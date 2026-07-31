function PageSkeleton({ rows = 3 }) {
  return (
    <div className="skeleton-page" aria-hidden="true">
      <div className="skeleton-card skeleton-title" />
      <div className="skeleton-card skeleton-text" />
      <div className="skeleton-grid">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="skeleton-card skeleton-item" />
        ))}
      </div>
    </div>
  );
}

export default PageSkeleton;
