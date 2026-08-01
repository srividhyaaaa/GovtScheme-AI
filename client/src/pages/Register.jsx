import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerRequest } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerRequest({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
      });

      const { token, user } = response;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userLoggedIn", "true");
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <h1>🇮🇳 GovAssist AI</h1>

        <h2>Create Your Account</h2>

        <p>
          Register to access personalized government schemes and AI assistance.
        </p>


        <form onSubmit={handleRegister}>
          {error && <p style={{ color: "#c0392b", marginBottom: "12px" }}>{error}</p>}

          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Full Name"
            required
          />

          <label>Email Address</label>
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
            placeholder="Create Password"
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />

          <button 
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>


        </form>



        <p className="login-link">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>


      </div>

    </div>
  );
}


export default Register;