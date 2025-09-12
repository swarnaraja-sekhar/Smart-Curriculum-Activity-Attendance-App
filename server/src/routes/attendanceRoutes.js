const express = require("express");
const router = express.Router();
const { markAttendance, getAttendance } = require("../controllers/attendanceController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/mark", protect, authorizeRoles("student", "teacher"), markAttendance);
router.get("/", protect, authorizeRoles("student", "teacher", "parent"), getAttendance);

module.exports = router;
