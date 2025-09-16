const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  classId: { type: String, required: true }, // The class the task is assigned to
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  dueDate: { type: Date },
  points: { type: Number, default: 10 }, // Points for gamification
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
