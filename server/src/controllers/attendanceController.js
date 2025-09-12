const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  const { status } = req.body;
  const attendance = await Attendance.create({
    user: req.user._id,
    status
  });
  res.status(201).json(attendance);
};

exports.getAttendance = async (req, res) => {
  const records = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
  res.json(records);
};
