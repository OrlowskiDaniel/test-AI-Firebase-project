export default function UsageCounter({ count, max }) {
  const limitReached = count >= max;

  return (
    <div className={`usage ${limitReached ? "usage-limit" : ""}`}>
      <span>
        Requests this session: {count} / {max}
      </span>
      {limitReached && (
        <p className="muted">
          Demo request limit reached. This is a safety mechanism to prevent
          accidental excessive API usage.
        </p>
      )}
    </div>
  );
}
