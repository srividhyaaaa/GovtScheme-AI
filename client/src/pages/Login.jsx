import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

function Login() {
  const navigate = useNavigate();
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
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userLoggedIn", "true");

      const savedProfile = localStorage.getItem("userProfile");

      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          const hasProfileData = Object.values(parsedProfile).some(
            (value) => value !== "" && value !== null && value !== undefined
          );

          navigate(hasProfileData ? "/dashboard" : "/profile");
        } catch (parseError) {
          console.error("Failed to parse saved profile", parseError);
          navigate("/profile");
        }
      } else {
        navigate("/profile");
      }
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