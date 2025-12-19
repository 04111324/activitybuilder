// src/routes/jobs.js
import express from "express";
import Job from "../../models/Job.js";

const router = express.Router();

// GET /jobs/:jobId - fetch single job status/result
router.get("/:jobId", async (req, res) => {
  const job = await Job.findOne({ jobId: req.params.jobId });
  if (!job) return res.sendStatus(404);
  res.json(job);
});

// GET /jobs - fetch all jobs, latest first
router.get("/", async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

export default router;
