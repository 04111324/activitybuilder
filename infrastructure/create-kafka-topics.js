import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "topic-creator",
  brokers: ["localhost:9092"],
});

const topics = [
  { topic: "generate-text-activity" },
  { topic: "generate-image-activity" },
];

async function createTopics() {
  const admin = kafka.admin();
  await admin.connect();

  await admin.createTopics({
    topics,
    waitForLeaders: true,
  });

  console.log("Topics created successfully");
  await admin.disconnect();
}

createTopics();
