import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "image-service",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "image-service-group" });

export async function initKafka() {
  await producer.connect();
  await consumer.connect();
  console.log("Kafka producer & consumer connected for Image Service");

  // Graceful shutdown
  const shutdown = async () => {
    console.log("Disconnecting Kafka...");
    await consumer.disconnect();
    await producer.disconnect();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
