import { useState } from "react";
import { createJob } from "../services/api";
import "../styles/App.css";

export default function JobForm({ onJobCreated }) {
  const [type, setType] = useState("text");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      await createJob(type, prompt);
      onJobCreated(); // signal parent to refresh
      setPrompt("");
    } catch (err) {
      console.error("Failed to create job", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="jobForm" onSubmit={handleSubmit}>
      <select
        className="jobFormSelect"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="text">Text</option>
        <option value="image">Image</option>
      </select>

      <input
        className="jobFormInput"
        type="text"
        placeholder="Enter prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button className="jobFormButton" type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
