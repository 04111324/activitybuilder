// src/kafka/index.js
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "image-service",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

export const consumer = kafka.consumer({ groupId: "image-service-group" });

export async function initKafka() {
  await consumer.connect();
  console.log("Image service Kafka consumer connected");
}
