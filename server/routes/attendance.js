const express = require('express');
const router = express.Router();
const { OPEN } = require('ws');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @route   POST /api/attendance/scan
// @desc    Record attendance from a QR scan and notify faculty via WebSocket.
// @access  Private (for students, but unprotected for this demo)
router.post('/scan', async (req, res) => {
  // Get the WebSocket server instance from the app's request context
  const { wss } = req.app.get('wss');
  const { qrData, studentId } = req.body;

  // --- 1. Input Validation ---
  if (!qrData || !studentId) {
    return res.status(400).json({ message: 'Missing required QR data or student ID.' });
  }

  try {
    // --- 2. QR Code Expiry Check ---
    if (Date.now() > qrData.expiryTime) {
      return res.status(400).json({ message: 'QR Code has expired. Please scan the new one.' });
    }

    // --- 3. Prevent Duplicate Attendance ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      student: studentId,
      classId: qrData.classId,
      date: { $gte: today },
    });

    if (existingAttendance) {
      return res.status(409).json({ message: 'Attendance already marked for this class today.' });
    }

    // --- 4. Save New Attendance Record to Database ---
    const newAttendance = new Attendance({
      student: studentId,
      classId: qrData.classId,
      date: new Date(),
      status: 'present',
      markedBy: qrData.facultyId, // The faculty who started the session
    });
    await newAttendance.save();

    // --- 5. Prepare WebSocket Payload ---
    const student = await Student.findById(studentId).select('name username');
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const payload = JSON.stringify({
      type: 'ATTENDANCE_UPDATE',
      data: {
        student: {
          _id: student._id,
          id: student._id.toString(),
          name: student.name,
          username: student.username,
        },
        status: 'present',
        time: newAttendance.date.toLocaleTimeString(),
      },
    });

    // --- 6. Broadcast to All Connected Clients ---
    // In a real-world app, you would target only the specific faculty member.
    wss.clients.forEach(client => {
      if (client.readyState === OPEN) {
        client.send(payload);
      }
    });

    res.status(201).json({ message: 'Attendance marked successfully!' });

  } catch (error) {
    console.error('Scan Error:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

