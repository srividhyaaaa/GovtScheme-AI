import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { register as registerRequest } from "../../services/authService";
import { getDefaultRedirect } from "../../utils/authUtils";
import { useToast } from "../../contexts/ToastContext";
import { getErrorMessage } from "../../utils/errorUtils";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [parentOccupation, setParentOccupation] = useState("");
  const [familyIncome, setFamilyIncome] = useState("");
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
      const response = await registerRequest({
        name,
        email,
        password,
        phone,
        state,
        parentOccupation,
        familyIncome,
      });
      login(response.token, response.user);
      const redirectPath = getDefaultRedirect(response.user);
      addToast({ title: "Account ready", message: "Your profile is set up and you can start exploring schemes.", type: "success" });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Unable to register. Please try again.");
      setError(errorMessage);
      addToast({ title: "Registration failed", message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="register-page">

      <div className="auth-card">
        <div className="auth-card__header">
          <div className="brand-mark">🇮🇳</div>
          <div>
            <h1>GovAssist AI</h1>
            <p>Create your account to discover scholarships tailored to your profile.</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="auth-form auth-form--stacked">
          <div className="field-group">
            <label htmlFor="register-name">Full name</label>
            <input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" required />
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="register-email">Email address</label>
              <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" required />
            </div>
            <div className="field-group">
              <label htmlFor="register-mobile">Mobile number</label>
              <input id="register-mobile" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter mobile number" />
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="register-state">State</label>
              <select id="register-state" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Select state</option>
                <option>Andhra Pradesh</option>
                <option>Telangana</option>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>Maharashtra</option>
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="register-occupation">Occupation</label>
              <select id="register-occupation" value={parentOccupation} onChange={(e) => setParentOccupation(e.target.value)}>
                <option value="">Select occupation</option>
                <option>Student</option>
                <option>Farmer</option>
                <option>Employee</option>
                <option>Business</option>
                <option>Self Employed</option>
              </select>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="register-income">Annual income</label>
            <input id="register-income" type="number" value={familyIncome} onChange={(e) => setFamilyIncome(e.target.value)} placeholder="Enter annual income" />
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="register-password">Password</label>
              <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" required />
            </div>
            <div className="field-group">
              <label htmlFor="register-confirm">Confirm password</label>
              <input id="register-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" required />
            </div>
          </div>

          {error ? <div className="error-message">{error}</div> : null}

          <button type="submit" className="primary-button auth-submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

    </div>
  );
}


export default Register;