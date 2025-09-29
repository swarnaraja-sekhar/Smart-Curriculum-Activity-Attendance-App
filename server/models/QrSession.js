const mongoose = require("mongoose");

const qrSessionSchema = new mongoose.Schema({
  classId: { 
    type: String,
    required: true 
  },
  subjectId: {
    type: String,
    required: true
  },
  facultyId: { 
    type: String,
    required: true 
  },
  sessionToken: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  expiresAt: { 
    type: Date, 
    required: true,
    // Automatically delete the session document after it expires
    // This keeps the collection clean
    expires: '1m' 
  }
}, { timestamps: true });

module.exports = mongoose.model("QrSession", qrSessionSchema);
