const mongoose = require("mongoose");

const qrSessionSchema = new mongoose.Schema({
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class',
    required: true 
  },
  facultyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Faculty',
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
