const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  day: { type: String, required: true },
  schedule: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Timetable", timetableSchema);
