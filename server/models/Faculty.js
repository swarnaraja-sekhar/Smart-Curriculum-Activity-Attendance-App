const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Hide by default
  branch: { type: String, required: true },
  classIds: [{ type: String, required: true }], 
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  role: { type: String, default: 'faculty' }
});

module.exports = mongoose.model('Faculty', facultySchema);
