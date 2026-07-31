function ProgressBar({ value }) {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="progress-bar-label">{percentage}% Complete</span>
    </div>
  );
}

export default ProgressBar;
