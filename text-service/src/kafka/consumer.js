import { consumer, initKafka } from "../index.js";
import { processTextJob } from "../processor.js";
import { emitJobStatus, sendToDLQ } from "../utils.js";
import Ajv from "ajv";
import fs from "fs";
import path from "path";

const ajv = new Ajv();
const MAX_RETRIES = 3;

// Load text-job schema
const textJobSchema = JSON.parse(
  fs.readFileSync("/shared/events/text-job.json")
);

export async function startConsumer() {
  await initKafka();
  await consumer.subscribe({ topic: "text-jobs", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      let job;
      try {
        job = JSON.parse(message.value.toString());

        // Validate job against schema
        const validate = ajv.compile(textJobSchema);
        if (!validate(job))
          throw new Error(
            "Validation failed: " + JSON.stringify(validate.errors)
          );

        const attempt = job.attempt || 1;

        // Emit PROCESSING status
        await emitJobStatus(job, "PROCESSING", attempt);

        // Process the job
        const result = await processTextJob(job);

        // Emit COMPLETED status
        await emitJobStatus(job, "COMPLETED", attempt, result);
      } catch (err) {
        const attempt = job?.attempt || 1;

        // Retry temporary errors
        if (err.message.includes("Temporary") && attempt < MAX_RETRIES) {
          job.attempt = attempt + 1;
          await emitJobStatus(job, "PROCESSING", job.attempt, err.message);
        } else {
          // Permanent failure or max retries
          await sendToDLQ(job || message.value.toString(), err);
          await emitJobStatus(
            job || message.value.toString(),
            "FAILED",
            attempt,
            err.message
          );
        }
      }
    },
  });
}
