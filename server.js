const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

app.use("/tasks", taskRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
