export default function ProjectInput({ value, onChange, onSubmit, disabled, loading }) {
  return (
    <div className="card">
      <label htmlFor="idea" className="label">
        Project idea
      </label>
      <textarea
        id="idea"
        className="textarea"
        rows={3}
        placeholder="e.g. I want a Unity game where players run a pancake restaurant"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <button
        className="button"
        onClick={onSubmit}
        disabled={disabled || value.trim().length === 0}
      >
        {loading ? "Generating..." : "Generate project"}
      </button>
    </div>
  );
}
