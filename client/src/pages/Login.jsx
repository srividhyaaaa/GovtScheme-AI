import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { getDefaultRedirect } from "../utils/authUtils";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginRequest({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      login(response.token, response.user);

      const redirectPath = getDefaultRedirect(response.user) || "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
          {error && <p style={{ color: "#c0392b", marginBottom: "12px" }}>{error}</p>}

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            required
          />


          <div className="login-options">

            <label>
              <input type="checkbox" />
              Remember Me
            </label>


            <a href="#">
              Forgot Password?
            </a>

          </div>


          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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