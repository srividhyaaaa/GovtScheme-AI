import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { login as loginRequest } from "../../services/authService";
import { getDefaultRedirect } from "../../utils/authUtils";
import { useToast } from "../../contexts/ToastContext";
import { getErrorMessage } from "../../utils/errorUtils";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    const formValues = {
      email: e.currentTarget.email?.value ?? email,
      password: e.currentTarget.password?.value ?? password,
    };

    setError(null);
    setLoading(true);

    try {
      const response = await loginRequest(formValues);
      login(response.token, response.user);

      const redirectPath = getDefaultRedirect(response.user) || from;
      addToast({ title: "Welcome back", message: "You are signed in and ready to explore schemes.", type: "success" });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Unable to login. Please try again.");
      setError(errorMessage);
      addToast({ title: "Login failed", message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <div className="auth-card">
        <div className="auth-card__header">
          <div className="brand-mark">🇮🇳</div>
          <div>
            <h1>GovAssist AI</h1>
            <p>Sign in to unlock benefits, eligibility insights, and AI guidance.</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="field-group">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error ? <div className="error-message">{error}</div> : null}

          <div className="auth-options">
            <label className="checkbox-row">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="primary-button auth-submit" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="auth-link">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>

    </div>
  );
}


export default Login;