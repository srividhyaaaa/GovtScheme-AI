import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary login simulation
    localStorage.setItem(
      "userLoggedIn",
      "true"
    );

    const savedProfile = localStorage.getItem("userProfile");

    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        const hasProfileData = Object.values(parsedProfile).some(
          (value) => value !== "" && value !== null && value !== undefined
        );

        navigate(hasProfileData ? "/dashboard" : "/profile");
      } catch (error) {
        console.error("Failed to parse saved profile", error);
        navigate("/profile");
      }
    } else {
      navigate("/profile");
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
            type="text"
            placeholder="Enter Email or Mobile Number"
            required
          />


          <label>Password</label>

          <input
            type="password"
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
          >
            Login
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