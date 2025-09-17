const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const QrSession = require('../models/QrSession');
const { OPEN } = require('ws');

// @route   POST /api/qr/start-session
// @desc    Faculty starts a new QR attendance session
// @access  Private (Faculty)
router.post('/start-session', auth, async (req, res) => {
  // Ensure the user is a faculty member
  if (req.user.role !== 'faculty') {
    return res.status(403).json({ message: 'Access denied. Only faculty can start sessions.' });
  }

  const { classId } = req.body;
  const facultyId = req.user.id;

  if (!classId) {
    return res.status(400).json({ message: 'Class ID is required.' });
  }

  try {
    // Generate a unique and secure session token
    const sessionToken = crypto.randomBytes(20).toString('hex');
    
    // Set an expiry time for the session (e.g., 1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create and save the new session
    const newSession = new QrSession({
      classId,
      facultyId,
      sessionToken,
      expiresAt,
    });

    await newSession.save();

    res.status(201).json({
      message: 'Session started successfully.',
      sessionToken,
      expiresAt,
    });

  } catch (error) {
    console.error('Error starting QR session:', error);
    res.status(500).json({ message: 'Server error while starting session.' });
  }
});

module.exports = router;
