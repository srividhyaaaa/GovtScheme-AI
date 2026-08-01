function Loader({ label = "Loading..." }) {
  return (
    <div className="loader-state" role="status" aria-live="polite">
      <div className="loader-spinner" />
      <p>{label}</p>
    </div>
  );
}

export default Loader;