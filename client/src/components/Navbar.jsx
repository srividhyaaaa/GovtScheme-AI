import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();


  const loggedIn = localStorage.getItem("userLoggedIn");


  const logout = () => {

    localStorage.removeItem("userLoggedIn");

    navigate("/login");

  };


  return (
    <nav className="navbar">


      <div className="logo">

        🇮🇳 <span>GovAssist AI</span>

      </div>



      <div className="nav-links">

        <Link to="/">
          Home
        </Link>


        <Link to="/schemes">
          Schemes
        </Link>



        {
          loggedIn && (

            <>

              <Link to="/dashboard">
                Dashboard
              </Link>


              <Link to="/chat">
                AI Assistant
              </Link>


              <Link to="/profile">
                Profile
              </Link>


            </>

          )
        }


      </div>



      <div className="auth-buttons">


        {
          loggedIn ? (

            <button
              className="logout-btn"
              onClick={logout}
            >
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