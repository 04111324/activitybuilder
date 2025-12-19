// src/kafka/consumer.js
import { Kafka } from "kafkajs";
import Job from "../../models/Job.js";

const kafka = new Kafka({
  clientId: "api-gateway",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "api-gateway-job-status" });

export async function startJobStatusConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "job-status", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      const { jobId, payload } = event;

      // Handle job-status events (from text-service, image-service)
      if (event.eventType === "JOB_STATUS_UPDATED") {
        const updateData = {
          status: payload.status.toLowerCase(),
          attempt: payload.attempt,
        };

        if (payload.errorMessage) {
          updateData.error = payload.errorMessage;
        }

        if (payload.result) {
          updateData.result = payload.result;
        }

        await Job.updateOne({ jobId }, updateData);
        console.log(`Job ${jobId} updated to ${payload.status}`);
      }
    },
  });

  console.log("Job status consumer running");
}
