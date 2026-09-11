import { useState } from "react";
import ProjectInput from "./components/ProjectInput";
import ProjectResult from "./components/ProjectResult";
import UsageCounter from "./components/UsageCounter";
import { generateProject } from "./services/gemini";
import "./styles.css";

// Client-side safety net: on top of Firebase App Check + Gemini's own
// server-side quotas, we refuse to send more than this many requests
// per browser session. This does NOT replace real server-side limits,
// but it makes it very hard to accidentally spam the API while testing.
const MAX_REQUESTS_PER_SESSION = 10;

export default function App() {
  const [idea, setIdea] = useState("");
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const limitReached = count >= MAX_REQUESTS_PER_SESSION;

  async function handleGenerate() {
    if (limitReached || loading) return;

    setLoading(true);
    setError(null);
    setProject(null);

    try {
      const result = await generateProject(idea);
      setProject(result);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setCount((c) => c + 1);
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Gemini Firebase Demo</h1>
        <p className="muted">
          React → Firebase AI Logic → Gemini Developer API. Sandbox project,
          no billing account attached.
        </p>
      </header>

      <ProjectInput
        value={idea}
        onChange={setIdea}
        onSubmit={handleGenerate}
        disabled={limitReached || loading}
        loading={loading}
      />

      <UsageCounter count={count} max={MAX_REQUESTS_PER_SESSION} />

      <ProjectResult project={project} error={error} loading={loading} />
    </div>
  );
}
