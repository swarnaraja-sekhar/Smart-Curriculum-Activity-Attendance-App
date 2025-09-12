const Task = require("../models/Task");

exports.getTasksByUser = async (userId) => Task.find({ assignedTo: userId });
exports.getTaskById = async (taskId) => Task.findById(taskId);
