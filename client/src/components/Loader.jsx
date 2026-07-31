<<<<<<< HEAD
function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-spinner" />
      <span>Loading...</span>
=======
function Loader({ label = "Loading..." }) {
  return (
    <div className="loader-state" role="status" aria-live="polite">
      <div className="loader-spinner" />
      <p>{label}</p>
>>>>>>> 134c790 (updated last 2 prompts)
    </div>
  );
}

export default Loader;
