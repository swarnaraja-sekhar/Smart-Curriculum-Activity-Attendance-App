const { body } = require("express-validator");

exports.timetableValidator = [
  body("day").notEmpty().withMessage("Day required"),
  body("schedule").notEmpty().withMessage("Schedule required"),
];
