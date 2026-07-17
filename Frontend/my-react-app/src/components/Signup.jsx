import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaRedo,
} from "react-icons/fa";

import "../styles/Signup.css";

function Signup({ setPage }) {
  return (
    <div className="signup-page">

      <div className="heading">

        <h1>Student Attendance</h1>

        <p>MANAGEMENT SYSTEM</p>

      </div>

      <div className="signup-card">

        <h2>Create Account</h2>

        <span className="subtitle">
          Admin Signup
        </span>

        <div className="input-box">

          <FaUser className="icon" />

          <input
            type="text"
            placeholder="Full Name"
          />

        </div>

        <div className="input-box">

          <FaEnvelope className="icon" />

          <input
            type="email"
            placeholder="Email Address"
          />

        </div>

        <div className="input-box">

          <FaLock className="icon" />

          <input
            type="password"
            placeholder="Password"
          />

        </div>

        <div className="input-box">

          <FaRedo className="icon" />

          <input
            type="password"
            placeholder="Confirm Password"
          />

        </div>

        <button className="signup-btn">
          Sign Up
        </button>

        <div className="login-link">

          Already have an account?

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage("login");
            }}
          >
            Login
          </a>

        </div>

      </div>

      <div className="footer">

        © 2024 ScholarTrack Attendance Systems.
        All rights reserved.

      </div>

    </div>
  );
}

export default Signup;