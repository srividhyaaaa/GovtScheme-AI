import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { register as registerRequest } from "../../services/authService";
import { getDefaultRedirect } from "../../utils/authUtils";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerRequest({ name, email, password });
      login(response.token, response.user);
      const redirectPath = getDefaultRedirect(response.user);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register. Please try again.");
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


          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Full Name"
            required
          />


          <label>Aadhaar Number</label>
          <input
            type="text"
            placeholder="XXXX XXXX XXXX"
          />


          <label>Mobile Number</label>
          <input
            type="tel"
            placeholder="Enter Mobile Number"
          />


          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />


          <label>State</label>

          <select required>
            <option value="">
              Select State
            </option>

            <option>
              Andhra Pradesh
            </option>

            <option>
              Telangana
            </option>

            <option>
              Karnataka
            </option>

            <option>
              Tamil Nadu
            </option>

            <option>
              Maharashtra
            </option>

          </select>



          <label>Occupation</label>

          <select required>

            <option value="">
              Select Occupation
            </option>

            <option>
              Student
            </option>

            <option>
              Farmer
            </option>

            <option>
              Employee
            </option>

            <option>
              Business
            </option>

            <option>
              Self Employed
            </option>

          </select>



          <label>Annual Income</label>

          <input
            type="number"
            placeholder="Enter Annual Income"
            required
          />


          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create Password"
            required
          />


          <label>Confirm Password</label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Registering…" : "Register"}
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