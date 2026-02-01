const Task = require("../models/Task");

// 📥 Get all tasks
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// ➕ Add new task
exports.addTask = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// 🔁 Toggle task completed / not completed
exports.toggleTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// 🗑️ Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};


exports.getDailyAnalysis = async (req, res, next) => {
  try {
    const tasks = await Task.find();

    const dailyData = {};

    tasks.forEach((task) => {
      const date = task.createdAt.toISOString().split("T")[0];

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          total: 0,
          completed: 0,
        };
      }

      dailyData[date].total += 1;
      if (task.completed) {
        dailyData[date].completed += 1;
      }
    });

    res.json(Object.values(dailyData));
  } catch (error) {
    next(error);
  }
};


exports.getLast28DaysAnalysis = async (req, res, next) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 28);

    const tasks = await Task.find({
      createdAt: { $gte: startDate },
    });

    let total = tasks.length;
    let completed = tasks.filter((t) => t.completed).length;

    const focusPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // 🧠 Weak task calculation
    const taskMap = {};

    tasks.forEach((task) => {
      const key = task.title.toLowerCase();

      if (!taskMap[key]) {
        taskMap[key] = { total: 0, completed: 0 };
      }

      taskMap[key].total += 1;
      if (task.completed) taskMap[key].completed += 1;
    });

    let weakestTask = null;
    let lowestRate = 100;

    Object.entries(taskMap).forEach(([title, info]) => {
      const rate = (info.completed / info.total) * 100;
      if (rate < lowestRate) {
        lowestRate = rate;
        weakestTask = title;
      }
    });

    res.json({
      period: "Last 28 Days",
      totalTasks: total,
      completedTasks: completed,
      focusPercent,
      focusStatus:
        focusPercent >= 75
          ? "Focused"
          : focusPercent >= 40
          ? "Average"
          : "Not Focused",
      weakestTask,
    });
  } catch (error) {
    next(error);
  }
};
