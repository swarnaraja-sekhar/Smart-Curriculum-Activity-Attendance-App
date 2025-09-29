const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  classId: { 
    type: String,  // Changed to String to match the data being sent
    required: true 
  },
  facultyId: { 
    type: String,  // Changed to String to match the data being sent
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  period: {
    type: String,
    default: '1'
  },
  scannedAt: {
    type: Date
  },
  status: { 
    type: String, 
    enum: ["Present", "Absent"], 
    default: "Present" 
  },
  sessionToken: { 
    type: String, 
    required: true,
    index: true
  }
}, { timestamps: true });

// Prevent a student from marking attendance twice for the same session
attendanceSchema.index({ studentId: 1, sessionToken: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);

