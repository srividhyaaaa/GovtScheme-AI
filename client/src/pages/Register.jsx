import { Link, useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();


  const handleRegister = (e) => {
    e.preventDefault();

    // Temporary registration simulation
    localStorage.setItem(
      "userLoggedIn",
      "true"
    );

    navigate("/profile");
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
            placeholder="Enter Full Name"
            required
          />


          <label>Aadhaar Number</label>
          <input
            type="text"
            placeholder="XXXX XXXX XXXX"
            required
          />


          <label>Mobile Number</label>
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            required
          />


          <label>Email Address</label>
          <input
            type="email"
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
            placeholder="Create Password"
            required
          />



          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm Password"
            required
          />



          <button 
            type="submit"
            className="register-button"
          >
            Register
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