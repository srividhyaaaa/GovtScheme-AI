import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { login as loginRequest } from "../../services/authService";
import { getDefaultRedirect } from "../../utils/authUtils";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginRequest({ email, password });
      login(response.token, response.user);

      const redirectPath = getDefaultRedirect(response.user) || from;
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <div className="login-card">

        <h1>🇮🇳 GovAssist AI</h1>

        <h2>Citizen Login</h2>

        <p>
          Login to access personalized government schemes and AI assistance.
        </p>


        <form onSubmit={handleLogin}>

          <label>Email / Mobile Number</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />


          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />


          {error && <div className="error-message">{error}</div>}

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>

            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>


        </form>


        <p className="register-link">

          Don't have an account?{" "}

          <Link to="/register">
            Register Here
          </Link>

        </p>


      </div>

    </div>
  );
}


export default Login;