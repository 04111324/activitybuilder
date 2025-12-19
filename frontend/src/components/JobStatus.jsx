import { useEffect, useState } from "react";
import { getJob } from "../services/api";
import "../styles/App.css";

export default function JobStatus({ jobId }) {
  const [job, setJob] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchJob = async () => {
      const data = await getJob(jobId);
      setJob(data);

      if (data.status === "completed" || data.status === "failed") {
        clearInterval(intervalId);
      }
    };

    fetchJob();
    intervalId = setInterval(fetchJob, 3000);

    return () => clearInterval(intervalId);
  }, [jobId]);

  if (!job) return <p className="jobStatus loading">Loading...</p>;

  return (
    <div className="jobStatus">
      <p className={`statusBadge ${job.status}`}>
        {job.status === "queued" && "⏳ Processing..."}
        {job.status === "processing" && "⚙️ Processing..."}
        {job.status === "completed" && "✅ Completed"}
        {job.status === "failed" && "❌ Failed"}
      </p>

      {job.status === "completed" && job.result && (
        <>
          {typeof job.result === "string" ? (
            <div className="jobResult">
              <p>{job.result}</p>
            </div>
          ) : (
            <>
              {job.result?.content && (
                <div className="jobResult">
                  <p>{job.result.content}</p>
                </div>
              )}

              {job.result?.imageUrl && (
                <img
                  src={job.result.imageUrl}
                  alt="Generated"
                  className="jobResultImage"
                />
              )}
            </>
          )}
        </>
      )}

      {job.error && <p className="jobError">Error: {job.error}</p>}
    </div>
  );
}
