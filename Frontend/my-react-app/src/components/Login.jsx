import {
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import "../styles/Login.css";

function Login({ setPage }) {

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary Login
    setPage("dashboard");
  };

  return (
    <div className="login-page">

      <div className="top-heading">
        <h1>Student Attendance</h1>
        <p>Management System</p>
      </div>

      <div className="login-card">

        <h2>Welcome Back</h2>

        <p className="subtitle">
          Sign in to your admin account
        </p>

        {/* Email */}
        <div className="input-box">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            placeholder="Email Address"
            required
          />
        </div>

        {/* Password */}
        <div className="input-box">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <div className="options">

          <label className="remember">
            <input type="checkbox" />
            <span>Remember Me</span>
          </label>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage("forgot");
            }}
          >
            Forgot Password?
          </a>

        </div>

        {/* Login Button */}
        <button
          className="login-btn"
          onClick={handleLogin}
        >
          Login
        </button>

        <div className="signup-text">
          Don't have an account?{" "}

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage("signup");
            }}
          >
            Sign Up
          </a>

        </div>

      </div>

      <div className="footer">
        © 2024 Attendance System. Designed for Education.
      </div>

    </div>
  );
}

export default Login;