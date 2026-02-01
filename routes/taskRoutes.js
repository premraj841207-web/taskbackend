const express = require("express");
const router = express.Router();

const {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
} = require("../controllers/taskController");

const { getDailyAnalysis ,getLast28DaysAnalysis} = require("../controllers/taskController");

// 📥 Get all tasks
router.get("/", getTasks);

// ➕ Add new task
router.post("/", addTask);

// 🔁 Toggle task complete
router.put("/:id", toggleTask);

// 🗑️ Delete task
router.delete("/:id", deleteTask);
router.get("/analysis", getDailyAnalysis);
router.get("/analysis/28days", getLast28DaysAnalysis);
module.exports = router;
