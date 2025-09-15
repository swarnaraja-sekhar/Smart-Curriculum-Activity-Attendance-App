const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Mark attendance
router.post('/', async (req, res) => {
  const { studentId, name, classId } = req.body;
  try {
    const record = new Attendance({ studentId, name, classId });
    await record.save();
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all attendance records
router.get('/', async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
