import { producer } from "./index.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processImageJob(job) {
  // Permanent validation error
  if (!job.payload?.prompt) throw new Error("Validation error: missing prompt");

  try {
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: job.payload.prompt,
      size: job.payload.size || "512x512",
      quality: "standard",
      n: 1,
    });

    const imageUrl = image.data[0].url;

    const result = {
      jobId: job.jobId,
      userId: job.userId,
      imageUrl: imageUrl,
      generatedAt: new Date().toISOString(),
      metadata: {
        width: parseInt((job.payload.size || "512x512").split("x")[0]),
        height: parseInt((job.payload.size || "512x512").split("x")[1]),
        style: job.payload.style,
      },
    };

    // Publish result to Kafka
    await producer.send({
      topic: "activity-results",
      messages: [{ value: JSON.stringify(result) }],
    });

    return result;
  } catch (error) {
    throw new Error(`AI image generation failed: ${error.message}`);
  }
}
