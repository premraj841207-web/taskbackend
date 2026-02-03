


const express = require("express");
const router = express.Router();
const connectDB = require("../config/db");

const {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
  getDailyAnalysis,
  getLast28DaysAnalysis
} = require("../controllers/taskController");

// 📥 Get all tasks
router.get("/", async (req, res, next) => {
  try {
    await connectDB();   // 🔥 Lazy DB connect
    await getTasks(req, res);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await connectDB();
    await addTask(req, res);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    await connectDB();
    await toggleTask(req, res);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await connectDB();
    await deleteTask(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/analysis", async (req, res, next) => {
  try {
    await connectDB();
    await getDailyAnalysis(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/analysis/28days", async (req, res, next) => {
  try {
    await connectDB();
    await getLast28DaysAnalysis(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
