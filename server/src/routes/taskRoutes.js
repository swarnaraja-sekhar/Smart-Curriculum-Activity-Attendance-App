const express = require("express");
const router = express.Router();
const { getTasks, getTaskDetail } = require("../controllers/taskController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", protect, authorizeRoles("student", "teacher", "parent"), getTasks);
router.get("/:id", protect, authorizeRoles("student", "teacher", "parent"), getTaskDetail);

module.exports = router;
