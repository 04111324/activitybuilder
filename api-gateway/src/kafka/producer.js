// src/kafka/producer.js
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "api-gateway",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

export const producer = kafka.producer();

export async function initProducer() {
  await producer.connect();
  console.log("Kafka producer connected");
}
