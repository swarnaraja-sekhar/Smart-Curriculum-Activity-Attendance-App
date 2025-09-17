const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const QrSession = require('../models/QrSession');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { OPEN } = require('ws');

// @route   POST /api/qr/start-session
// @desc    Faculty starts a new QR attendance session and creates initial absent records
// @access  Private (Faculty)
router.post('/start-session', auth, async (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ message: 'Access denied. Only faculty can start sessions.' });
  }

  const { classId, subjectId, period } = req.body;
  const facultyId = req.user.id;

  if (!classId || !subjectId || !period) {
    return res.status(400).json({ message: 'Class ID, Subject ID, and Period are required.' });
  }

  try {
    // 1. Generate a unique and secure session token
    const sessionToken = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity

    // 2. Create and save the new QR session
    const newSession = new QrSession({
      class: classId,
      subject: subjectId,
      faculty: facultyId,
      sessionToken,
      expiresAt,
    });
    await newSession.save();

    // 3. Find all students in the specified class
    const students = await Student.find({ class: classId }).select('_id');
    console.log(`Found ${students.length} students for classId: ${classId}`); // Diagnostic log

    if (!students || students.length === 0) {
      // Still save the session, but inform the faculty that no students were found.
      // This is better than a generic error.
      console.warn(`No students found for class ${classId}. Session was created, but no attendance records were initialized.`);
      return res.status(201).json({
        message: 'Session started, but no students were found for this class. No attendance records were created.',
        sessionToken,
        expiresAt,
      });
    }

    // 4. Create 'absent' attendance records for all students for this session
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecords = students.map(student => ({
      student: student._id,
      class: classId,
      subject: subjectId,
      faculty: facultyId,
      date: today,
      status: 'absent',
      period,
      sessionToken, // Link attendance to this specific QR session
    }));

    try {
      await Attendance.insertMany(attendanceRecords);
      console.log(`Successfully created ${attendanceRecords.length} 'absent' attendance records for session: ${sessionToken}`); // Diagnostic log
    } catch (insertError) {
      console.error('Error inserting attendance records:', insertError);
      // If this fails, we should ideally roll back the session creation, but for now, we'll return a specific error.
      return res.status(500).json({ message: 'Session created, but failed to initialize student attendance records.' });
    }


    // 5. Respond with success
    res.status(201).json({
      message: 'Session started and attendance initialized.',
      sessionToken,
      expiresAt,
    });

  } catch (error) {
    console.error('Error starting QR session:', error);
    res.status(500).json({ message: 'Server error while starting session.' });
  }
});

module.exports = router;
