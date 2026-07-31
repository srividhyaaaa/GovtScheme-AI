import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for may have moved, been removed, or never existed.</p>
        <div className="not-found-actions">
          <Link to="/" className="primary-button">Go home</Link>
          <Link to="/schemes" className="secondary-button">Explore schemes</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;