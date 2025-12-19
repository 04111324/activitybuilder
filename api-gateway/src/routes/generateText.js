// api-gateway/src/routes/generateText.js
import express from "express";
import Job from "../../models/Job.js";
import { v4 as uuidv4 } from "uuid";

export default function generateTextRoutes(producer) {
  const router = express.Router();

  router.post("/generate-activity", async (req, res) => {
    const { type, prompt, userId = uuidv4(), options = {} } = req.body;

    if (!type || !prompt) {
      return res.status(400).json({ error: "type and prompt are required" });
    }

    const jobId = uuidv4();

    try {
      await Job.create({
        jobId,
        type,
        prompt,
        userId,
        status: "queued",
      });

      const event = {
        eventType:
          type === "text" ? "TEXT_JOB_REQUESTED" : "IMAGE_JOB_REQUESTED",
        version: 1,
        jobId,
        userId,
        timestamp: new Date().toISOString(),
        payload:
          type === "text"
            ? { prompt, options: { language: options.language || "en" } }
            : { prompt, size: options.size || "512x512", style: options.style },
      };

      await producer.send({
        topic: type === "text" ? "text-jobs" : "image-jobs",
        messages: [{ value: JSON.stringify(event) }],
      });

      res.json({ jobId });
    } catch (err) {
      console.error("Failed to create job:", err);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  return router;
}
