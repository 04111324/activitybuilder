import express from "express";
import { startConsumer } from "./kafka/consumer.js";

const app = express();
app.use(express.json());

// Health check
app.get("/health", (_, res) => res.sendStatus(200));

// Root route
app.get("/", (_, res) => res.send("Text Service Running"));

// Start Kafka consumer
startConsumer().catch(console.error);

// Start Express server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () =>
  console.log(
    `Text Service running on port ${PORT}, NODE_ENV=${process.env.NODE_ENV}`
  )
);
