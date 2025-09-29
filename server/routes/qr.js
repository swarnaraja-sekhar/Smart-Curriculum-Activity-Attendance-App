const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const QrSession = require('../models/QrSession');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { OPEN } = require('ws');

const sessionController = require('../controllers/sessionController');
const attendanceController = require('../controllers/attendanceController');

// @route   POST /api/qr/start-session
// @desc    Faculty starts a new QR attendance session and creates initial absent records
// @access  Private (Faculty)
router.post('/start-session', auth, sessionController.startSession);

// @route   POST /api/qr/scan
// @desc    Student scans QR code to mark attendance
// @access  Private (Student)
router.post('/scan', auth, attendanceController.markAttendance);

// @route   GET /api/qr/attendance/:token
// @desc    Get live attendance statistics for a session
// @access  Private (Faculty)
router.get('/attendance/:token', auth, attendanceController.getAttendanceStats);

// Test routes without auth for debugging
router.get('/test/attendance/:token', attendanceController.getAttendanceStats);
router.post('/test/scan', (req, res, next) => {
  req.user = { id: 'test-student', rollNumber: 'TEST001' };
  next();
}, attendanceController.markAttendance);

module.exports = router;
