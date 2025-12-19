// src/app.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import generateTextRoutes from "./routes/generateText.js";
import jobRoutes from "./routes/jobs.js";

import { initProducer, producer } from "./kafka/producer.js";
import { startJobStatusConsumer } from "./kafka/consumer.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// Connect to MongoDB
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// =======================
// Kafka
// =======================
await initProducer(); // Producer
startJobStatusConsumer().catch(console.error); // Job-status consumer

// =======================
// Routes
// =======================
app.use("/", generateTextRoutes(producer));
app.use("/jobs", jobRoutes);

// =======================
// Health check
// =======================
app.get("/health", (_, res) => res.sendStatus(200));

// =======================
// Start server
// =======================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(
    `API Gateway running on port ${PORT}, NODE_ENV=${process.env.NODE_ENV}`
  )
);
