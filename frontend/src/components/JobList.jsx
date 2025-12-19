import { useEffect, useState } from "react";
import { getJobs } from "../services/api";
import JobStatus from "./JobStatus";
import "../styles/App.css";

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  const loadJobs = async () => {
    const data = await getJobs();
    setJobs(data);
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="jobList">
      <h2>Generated Activities</h2>

      {jobs.length === 0 ? (
        <p className="noJobs">No activities generated yet. Create one above!</p>
      ) : (
        jobs.map((job) => (
          <div key={job.jobId} className="jobCard">
            <div className="jobCardHeader">
              <span className="jobType">{job.type.toUpperCase()}</span>
              <span className="jobPrompt">{job.prompt}</span>
            </div>

            <JobStatus jobId={job.jobId} />
          </div>
        ))
      )}
    </div>
  );
}
