const Attendance = require("../models/Attendance");

exports.markAttendance = async (userId, status) => {
  return await Attendance.create({ user: userId, status });
};

exports.getAttendanceByUser = async (userId) => {
  return await Attendance.find({ user: userId }).sort({ date: -1 });
};
