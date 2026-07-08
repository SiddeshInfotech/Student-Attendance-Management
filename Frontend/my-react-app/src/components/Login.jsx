import "../styles/Login.css";
import { FaUserGraduate, FaEnvelope, FaLock } from "react-icons/fa";

function Login({ goToSignup, goToForgot, goToDashboard }) {
  return (
    <div className="login-container">

      {/* Left Side */}
      <div className="left-panel">
        <div className="overlay">
          <div className="brand">
            <FaUserGraduate className="brand-icon" />

            <h1>Student Attendance</h1>

            <h2>Management System</h2>

            <p>
              Smart attendance tracking platform for colleges and universities.
              Manage students, monitor attendance and generate reports from one dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="right-panel">

        <div className="login-card">

          <h3>Welcome Back 👋</h3>

          <span>Admin Login</span>

          <div className="input-box">
            <FaEnvelope />
            <input type="email" placeholder="Email Address" />
          </div>

          <div className="input-box">
            <FaLock />
            <input type="password" placeholder="Password" />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goToForgot();
              }}
            >
              Forgot Password?
            </a>
          </div>

          <button
            className="login-btn"
            onClick={goToDashboard}
          >
            Login
          </button>

          <p className="signup-text">
            Don't have an account?
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goToSignup();
              }}
            >
              Sign Up
            </a>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;