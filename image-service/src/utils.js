import Ajv from "ajv";
import addFormats from "ajv-formats";
import fs from "fs";
import path from "path";
import { producer } from "./index.js";

const ajv = new Ajv();
addFormats(ajv);

// Load schemas
const jobStatusSchema = JSON.parse(
  fs.readFileSync(path.resolve("/shared/events/job-status.json"))
);
const dlqSchema = JSON.parse(
  fs.readFileSync(path.resolve("/shared/events/dead-letter-jobs.json"))
);

export async function emitJobStatus(
  event,
  status,
  attempt = 1,
  errorMessage = null,
  result = null
) {
  const jobStatusEvent = {
    eventType: "JOB_STATUS_UPDATED",
    version: 1,
    jobId: event.jobId,
    userId: event.userId,
    timestamp: new Date().toISOString(),
    payload: {
      status,
      attempt,
      errorMessage,
      result,
      service: "image-service",
    },
  };

  const validate = ajv.compile(jobStatusSchema);
  if (!validate(jobStatusEvent)) console.error(validate.errors);

  await producer.send({
    topic: "job-status",
    messages: [{ value: JSON.stringify(jobStatusEvent) }],
  });
}

export async function sendToDLQ(event, error) {
  const dlqEvent = {
    eventType: "DEAD_LETTER_JOB",
    version: 1,
    originalEvent: event,
    error: error.message,
    failedAt: new Date().toISOString(),
  };

  const validate = ajv.compile(dlqSchema);
  if (!validate(dlqEvent)) console.error(validate.errors);

  await producer.send({
    topic: "dead-letter-jobs",
    messages: [{ value: JSON.stringify(dlqEvent) }],
  });
}
