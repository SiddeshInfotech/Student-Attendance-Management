import "../styles/ForgotPassword.css";
import StudentImage from "../assets/images/student-login.png";

import { FaEnvelope } from "react-icons/fa";

function ForgotPassword({ goToLogin }) {
  return (
    <div className="forgot-container">

      {/* Left Panel */}

      <div className="left-panel">

        <div className="overlay">

          <div className="brand">

            {/* Student Image */}
            <img
              src={StudentImage}
              alt="Student"
              className="student-image"
            />

            <h1>Student Attendance</h1>

            <h2>Management System</h2>

            <p>
              Forgot your password? Don't worry. Enter your registered email
              address and we'll help you reset your password securely.
            </p>

          </div>

        </div>

      </div>

      {/* Right Panel */}

      <div className="right-panel">

        <div className="forgot-card">

          <h3>Reset Password</h3>

          <span>Recover your account</span>

          <div className="input-group">

            <FaEnvelope />

            <input
              type="email"
              placeholder="Registered Email Address"
            />

          </div>

          <button className="reset-btn">
            Send Reset Link
          </button>

          <p className="bottom-text">

            Remember your password?

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goToLogin();
              }}
            >
              Login
            </a>

          </p>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;