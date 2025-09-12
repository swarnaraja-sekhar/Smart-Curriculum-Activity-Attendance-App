const User = require("../models/User");

exports.findUserById = async (id) => await User.findById(id);
exports.findUserByEmail = async (email) => await User.findOne({ email });
