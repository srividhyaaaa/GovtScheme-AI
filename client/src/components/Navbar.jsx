import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <nav className="navbar">


      <div className="logo">
        <img src="/logo.png" alt="GovAssist AI" />
        <span>GovAssist AI</span>
  </div>



      <div className="nav-links">

        <Link to="/">
          Home
        </Link>


        <Link to="/schemes">
          Schemes
        </Link>



        {isAuthenticated && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/chat">AI Assistant</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}


      </div>



      <div className="auth-buttons">
        {isAuthenticated ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (

            <>

              <Link 
                className="login-btn" 
                to="/login"
              >
                Login
              </Link>


              <Link 
                className="register-btn" 
                to="/register"
              >
                Register
              </Link>

            </>

          )
        }


      </div>


    </nav>
  );
}


export default Navbar;