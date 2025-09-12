const Timetable = require("../models/Timetable");

exports.getTimetable = async (req, res) => {
  const timetable = await Timetable.find({ user: req.user._id });
  res.json(timetable);
};
