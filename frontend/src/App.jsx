import { useState } from "react";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import "./styles/App.css";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="appContainer">
      <h1 className="appHeader">Activity Builder</h1>

      <JobForm onJobCreated={() => setRefreshKey((k) => k + 1)} />
      <JobList key={refreshKey} />
    </div>
  );
}
