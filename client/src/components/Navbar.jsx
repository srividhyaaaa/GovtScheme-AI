import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Modal from "./Modal";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <>
      <nav className="navbar">
        <Link className="brand" to="/">
          <span className="brand-mark">⚡</span>
          <span>GovAssist AI</span>
        </Link>

        <div className="nav-links">
          <NavLink className={linkClass} to="/">Home</NavLink>
          <NavLink className={linkClass} to="/schemes">Schemes</NavLink>

          {isAuthenticated && (
            <>
              <NavLink className={linkClass} to="/dashboard">
                Dashboard
              </NavLink>
              <NavLink className={linkClass} to="/chat">
                AI Assistant
              </NavLink>
              <NavLink className={linkClass} to="/compare">
                Compare
              </NavLink>
              <NavLink className={linkClass} to="/roadmap">
                Roadmap
              </NavLink>
              <NavLink className={linkClass} to="/profile">
                Profile
              </NavLink>
            </>
          )}
        </div>

        <div className="auth-buttons">
          <button
            className="theme-toggle"
            type="button"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>

          {isAuthenticated ? (
            <button
              className="logout-btn"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
          ) : (
            <>
              <Link className="login-btn" to="/login">
                Login
              </Link>
              <Link className="register-btn" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <Modal
        open={showLogoutModal}
        title="Confirm logout"
        onClose={() => setShowLogoutModal(false)}
        actions={
          <>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={handleLogout}
            >
              Confirm logout
            </button>
          </>
        }
      >
        <p>Are you sure you want to sign out of GovAssist AI?</p>
      </Modal>
    </>
  );
}

export default Navbar;