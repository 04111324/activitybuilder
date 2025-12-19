import express from "express";
import { startConsumer } from "./kafka/consumer.js";

const app = express();
app.use(express.json());

// Health check
app.get("/health", (_, res) => res.sendStatus(200));

// Root route
app.get("/", (_, res) => res.send("Image Service Running"));

// Start Kafka consumer
startConsumer().catch(console.error);

// Start Express server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(
    `Image Service running on port ${PORT}, NODE_ENV=${process.env.NODE_ENV}`
  )
);
