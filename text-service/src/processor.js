import { producer } from "./index.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processTextJob(job) {
  // Permanent validation error
  if (!job.payload?.prompt) throw new Error("Validation error: missing prompt");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates creative text for kids' activities. Keep responses age-appropriate and engaging.",
        },
        {
          role: "user",
          content: job.payload.prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const generatedText = completion.choices[0].message.content;

    const result = {
      jobId: job.jobId,
      userId: job.userId,
      content: generatedText,
      language: job.payload.options?.language || "en",
      timestamp: new Date().toISOString(),
    };

    // Publish result to Kafka
    await producer.send({
      topic: "activity-results",
      messages: [{ value: JSON.stringify(result) }],
    });

    return result;
  } catch (error) {
    throw new Error(`AI generation failed: ${error.message}`);
  }
}
