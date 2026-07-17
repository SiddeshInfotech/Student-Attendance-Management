import { FaEnvelope } from "react-icons/fa";
import "../styles/ForgotPassword.css";

function ForgotPassword({ setPage }) {
  return (
    <div className="forgot-page">

      <div className="forgot-header">
        <h1>Student Attendance</h1>
        <p>MANAGEMENT SYSTEM</p>
      </div>

      <div className="forgot-card">

        <h2>Reset Password</h2>

        <p className="forgot-subtitle">
          Enter your registered email address and we'll help you
          reset your password securely.
        </p>

        <div className="forgot-input">

          <FaEnvelope className="forgot-icon" />

          <input
            type="email"
            placeholder="Registered Email Address"
          />

        </div>

        <button className="forgot-btn">
          Send Reset Link
        </button>

        <div className="back-login">

          Remember your password?

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

      <div className="forgot-footer">
        © 2024 Attendance System. Designed for Education.
      </div>

    </div>
  );
}

export default ForgotPassword;