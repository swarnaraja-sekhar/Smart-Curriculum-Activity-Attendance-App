const express = require("express");
const router = express.Router();
const { getTimetable } = require("../controllers/timetableController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", protect, authorizeRoles("student", "teacher", "parent"), getTimetable);

module.exports = router;
