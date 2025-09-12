const { body } = require("express-validator");

exports.taskValidator = [
  body("title").notEmpty().withMessage("Task title required"),
  body("description").notEmpty().withMessage("Task description required"),
];
