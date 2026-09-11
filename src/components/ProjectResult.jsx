export default function ProjectResult({ project, error, loading }) {
  if (loading) {
    return (
      <div className="card">
        <p className="muted">Generating...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card card-error">
        <p>Unable to generate the project.</p>
        <p className="muted">You can try again later.</p>
        <details>
          <summary>Technical details</summary>
          <pre className="pre">{error}</pre>
        </details>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="card">
        <p className="muted">No result yet. Enter an idea and click Generate.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>{project.title}</h2>
      <p>{project.description}</p>

      <ResultList title="Objectives" items={project.objectives} />
      <ResultList title="Tasks" items={project.tasks} />
      <ResultList title="Skills" items={project.skills} />
      <ResultList title="Deliverables" items={project.deliverables} />
    </div>
  );
}

function ResultList({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="result-section">
      <h3>{title}</h3>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
