const express = require('express');
const router = express.Router();
const { OPEN } = require('ws');
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const QrSession = require('../models/QrSession'); // Import the new session model

// @route   POST /api/attendance/scan
// @desc    Record attendance from a QR scan by updating status from 'absent' to 'present'
// @access  Private (Student)
router.post('/scan', auth, async (req, res) => {
  // 1. Ensure the user is a student
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Only students can scan for attendance.' });
  }

  const { sessionToken } = req.body;
  const studentId = req.user.id;
  const { wss } = req.app.get('wss');

  if (!sessionToken) {
    return res.status(400).json({ message: 'Session token is required.' });
  }

  try {
    // 2. Validate the session token is active
    const session = await QrSession.findOne({ sessionToken, expiresAt: { $gt: new Date() } });
    if (!session) {
      return res.status(404).json({ message: 'Attendance session not found or has expired.' });
    }

    // 3. Find the pre-existing attendance record and update it
    const attendanceRecord = await Attendance.findOneAndUpdate(
      { student: studentId, sessionToken, status: 'absent' }, // Find the 'absent' record for this student and session
      { $set: { status: 'present', markedAt: new Date() } }, // Update the status to 'present'
      { new: true } // Return the updated document
    );

    // 4. Handle cases where no record was found or it was already marked
    if (!attendanceRecord) {
      // Check if it was already marked 'present'
      const alreadyMarked = await Attendance.findOne({ student: studentId, sessionToken, status: 'present' });
      if (alreadyMarked) {
        return res.status(409).json({ message: 'You have already marked attendance for this session.' });
      }
      // Otherwise, the student was not part of the class when the session started
      return res.status(404).json({ message: 'Attendance record not found. You may not be enrolled in this class session.' });
    }

    // 5. Prepare and send WebSocket payload to notify faculty in real-time
    const student = await Student.findById(studentId).select('name username');
    if (!student) {
      // This is unlikely if an attendance record existed, but good practice to check
      return res.status(404).json({ message: 'Student record not found.' });
    }

    const payload = JSON.stringify({
      type: 'ATTENDANCE_UPDATE',
      data: {
        student: {
          id: student._id.toString(),
          name: student.name,
          username: student.username,
        },
        status: 'present',
        time: attendanceRecord.markedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    });

    // Broadcast to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === OPEN) {
        client.send(payload);
      }
    });

    res.status(200).json({ message: 'Attendance marked successfully!' });

  } catch (error) {
    console.error('Error in /scan endpoint:', error);
    res.status(500).json({ message: 'Server error while marking attendance.' });
  }
});

// @route   GET /api/attendance/student/:studentId
// @desc    Get aggregated attendance data for a specific student
// @access  Private (Student)
router.get('/student/:studentId', auth, async (req, res) => {
  if (req.user.id !== req.params.studentId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
  }

  try {
      const studentId = req.params.studentId;

      const attendanceStats = await Attendance.aggregate([
          // Match records for the specific student
          { $match: { student: new require('mongoose').Types.ObjectId(studentId) } },
          
          // Populate subject details
          {
              $lookup: {
                  from: 'subjects', // The actual name of the subjects collection
                  localField: 'subject',
                  foreignField: '_id',
                  as: 'subjectDetails'
              }
          },
          // Deconstruct the subjectDetails array
          { $unwind: '$subjectDetails' },
          
          // Group by subject to calculate totals
          {
              $group: {
                  _id: '$subject',
                  name: { $first: '$subjectDetails.name' },
                  code: { $first: '$subjectDetails.code' },
                  attended: {
                      $sum: {
                          $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
                      }
                  },
                  total: { $sum: 1 }
              }
          },
          
          // Project to format the final output
          {
              $project: {
                  _id: 0,
                  id: '$_id',
                  name: '$name',
                  code: '$code',
                  attended: '$attended',
                  total: '$total'
              }
          }
      ]);

      if (!attendanceStats) {
          return res.status(404).json({ message: 'No attendance data found for this student.' });
      }

      res.json(attendanceStats);

  } catch (error) {
      console.error('Error fetching student attendance:', error);
      res.status(500).json({ message: 'Server error while fetching attendance data.' });
  }
});

module.exports = router;

