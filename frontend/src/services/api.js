import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createJob = async (type, prompt, userId = "anonymous") => {
  const response = await apiClient.post("/generate-activity", {
    type,
    prompt,
    userId,
  });
  return response.data;
};

export const getJob = async (jobId) => {
  const response = await apiClient.get(`/jobs/${jobId}`);
  return response.data;
};

export const getJobs = async () => {
  const response = await apiClient.get("/jobs");
  return response.data;
};
