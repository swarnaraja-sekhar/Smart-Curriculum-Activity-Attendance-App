const mongoose = require('mongoose');

const studentTaskSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  status: { type: String, enum: ['Pending', 'Submitted', 'Graded', 'Overdue'], default: 'Pending' },
  submittedOn: { type: Date },
  grade: { type: String }
}, { _id: false });

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['Task', 'Badge', 'General'], default: 'General' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  branch: { type: String, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  role: { type: String, default: 'student' },
  
  // Gamification and Progress
  progressPoints: { type: Number, default: 0 },
  badges: [{ type: String }], // e.g., ["Task Master", "Perfect Attendance"]
  
  // Tasks and Certificates
  tasks: [studentTaskSchema],
  certificates: [{
    title: { type: String, required: true },
    issuedBy: { type: String, required: true },
    issuedOn: { type: Date, default: Date.now },
    fileURL: { type: String }
  }],

  // Notifications
  notifications: [notificationSchema]
});

module.exports = mongoose.model('Student', studentSchema);
