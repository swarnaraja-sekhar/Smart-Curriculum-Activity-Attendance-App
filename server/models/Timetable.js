const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  period: { type: Number, required: true },
  subjectName: { type: String, required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  facultyName: { type: String, required: true },
  time: { type: String, required: true } // e.g., "09:00 AM - 10:00 AM"
}, { _id: false });

const dayScheduleSchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  periods: [periodSchema]
}, { _id: false });

const timetableSchema = new mongoose.Schema({
  classId: { 
    type: String, 
    required: true, 
    unique: true // Ensures one timetable per class
  },
  schedule: [dayScheduleSchema],
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Faculty', 
    required: true 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  version: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Middleware to increment version on update
timetableSchema.pre('findOneAndUpdate', function(next) {
  this.set({ lastUpdated: new Date() });
  this.update({}, { $inc: { version: 1 } });
  next();
});

module.exports = mongoose.model('Timetable', timetableSchema);
