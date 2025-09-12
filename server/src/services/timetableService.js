const Timetable = require("../models/Timetable");

exports.getTimetableByUser = async (userId) => Timetable.find({ user: userId });
