import "../styles/Login.css";
import StudentImage from "../assets/images/student-login.png";

import {
  FaEnvelope,
  FaLock
} from "react-icons/fa";

function Login({
  goToSignup,
  goToForgot,
  goToDashboard,
}) {

  return (

    <div className="login-container">

      {/* ================= LEFT PANEL ================= */}

      <div className="left-panel">

        <div className="overlay">

          <div className="brand">

            {/* Student Image */}

            <img
              src={StudentImage}
              alt="Student"
              className="student-image"
            />

            <h1>
              Student Attendance
            </h1>

            <h2>
              Management System
            </h2>

            <div className="line"></div>

            <p>
              Smart attendance tracking platform for colleges and universities.
              Manage students, monitor attendance and generate reports from one dashboard.
            </p>

          </div>

        </div>

      </div>

      {/* ================= RIGHT PANEL ================= */}

      <div className="right-panel">

        <div className="login-card">

          <h3>
            Welcome Back 👋
          </h3>

          <span>
            Admin Login
          </span>

          {/* Email */}

          <div className="input-box">

            <FaEnvelope />

            <input
              type="email"
              placeholder="Email Address"
            />

          </div>

          {/* Password */}

          <div className="input-box">

            <FaLock />

            <input
              type="password"
              placeholder="Password"
            />

          </div>

          {/* Options */}

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

          {/* Login */}

          <button
            className="login-btn"
            onClick={goToDashboard}
          >
            Login
          </button>

          {/* Signup */}

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