import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true },
    userId: { type: String },
    type: { type: String, enum: ["text", "image"], required: true },
    prompt: { type: String, required: true },

    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
    },

    attempt: { type: Number, default: 1 },
    result: { type: String },
    error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
