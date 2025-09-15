const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  role: { type: String, default: 'admin' }
});

module.exports = mongoose.model('Admin', adminSchema);
