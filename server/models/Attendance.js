const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', // Assuming you have a Class model
    required: true 
  },
  facultyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Faculty', 
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

