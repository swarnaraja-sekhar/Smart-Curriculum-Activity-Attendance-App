const express = require('express');
const router = express.Router();
const { OPEN } = require('ws');
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const QrSession = require('../models/QrSession'); // Import the new session model

// @route   POST /api/attendance/scan
// @desc    Record attendance from a QR scan
// @access  Private (Student)
router.post('/scan', auth, async (req, res) => {
  // Ensure the user is a student
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Only students can scan for attendance.' });
  }

  const { wss } = req.app.get('wss');
  const studentId = req.user.id;
  const { sessionToken, classId, facultyId } = req.body.qrData;

  if (!sessionToken || !classId || !facultyId) {
    return res.status(400).json({ message: 'Invalid QR code data.' });
  }

  try {
    // 1. Validate the session token
    const session = await QrSession.findOne({ sessionToken });
    if (!session) {
      return res.status(404).json({ message: 'Attendance session not found or has expired.' });
    }

    // Optional: Check if session is expired (though MongoDB TTL should handle it)
    if (new Date() > session.expiresAt) {
      return res.status(400).json({ message: 'This attendance session has expired.' });
    }

    // 2. Check for duplicate attendance in this session
    const existingAttendance = await Attendance.findOne({ studentId, sessionToken });
    if (existingAttendance) {
      return res.status(409).json({ message: 'You have already marked attendance for this session.' });
    }

    // 3. Save the new attendance record
    const newAttendance = new Attendance({
      classId,
      facultyId,
      studentId,
      sessionToken,
      status: 'Present',
    });
    await newAttendance.save();

    // 4. Prepare and send WebSocket payload
    const student = await Student.findById(studentId).select('name username');
    if (!student) {
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
        status: 'Present',
        time: newAttendance.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    });

    // Broadcast to all clients (can be refined to target specific faculty)
    wss.clients.forEach(client => {
      if (client.readyState === OPEN) {
        client.send(payload);
      }
    });

    res.status(201).json({ message: 'Attendance marked successfully!' });

  } catch (error) {
    console.error('Error in /scan endpoint:', error);
    // Handle specific error for duplicate key
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Attendance already marked for this session.' });
    }
    res.status(500).json({ message: 'Server error while marking attendance.' });
  }
});

module.exports = router;

