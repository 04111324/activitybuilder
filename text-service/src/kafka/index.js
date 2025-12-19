// src/kafka/index.js
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "text-service",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

export const consumer = kafka.consumer({ groupId: "text-service-group" });

export async function initKafka() {
  await consumer.connect();
  console.log("Text service Kafka consumer connected");
}
