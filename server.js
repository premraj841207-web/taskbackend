// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const taskRoutes = require("./routes/taskRoutes");
// const errorHandler = require("./middlewares/errorHandler");

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => {
//     console.error(err.message);
//     process.exit(1);
//   });

// app.use("/tasks", taskRoutes);

// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const taskRoutes = require("../routes/taskRoutes");
const errorHandler = require("../middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (important for Vercel)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// routes
app.get("/", (req, res) => {
  res.json({
    message: "Task API running 🚀",
    endpoints: {
      tasks: "/tasks"
    }
  });
});
app.use("/tasks", taskRoutes);

// error handler
app.use(errorHandler);

// ❌ app.listen MAT likhna
module.exports = app;
