const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB (Vercel-safe)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Task API running 🚀",
    endpoints: {
      tasks: "/tasks",
    },
  });
});

app.use("/tasks", taskRoutes);
app.use(errorHandler);

module.exports = app;
