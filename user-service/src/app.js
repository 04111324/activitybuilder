const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connect to MongoDB
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongo:27017/kids-activity-users";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("User Service connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Sample route
app.get("/", (req, res) => {
  res.send("User Service Running");
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
