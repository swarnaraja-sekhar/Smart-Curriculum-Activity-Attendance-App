const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const QrSession = require('../models/QrSession');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { OPEN } = require('ws');

const sessionController = require('../controllers/sessionController');

// @route   POST /api/qr/start-session
// @desc    Faculty starts a new QR attendance session and creates initial absent records
// @access  Private (Faculty)
router.post('/start-session', auth, sessionController.startSession);

module.exports = router;
