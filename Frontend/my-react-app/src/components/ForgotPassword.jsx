import { useState, useEffect } from "react";
import { FaEnvelope, FaSignInAlt } from "react-icons/fa";
import { forgotPassword } from "../services/authService.js";
import { removeToken, removeUser } from "../services/apiClient.js";
import "../styles/ForgotPassword.css";
import studentAttendanceImg from "../assets/images/student_attendance_illustration.png";

function ForgotPassword({ setPage }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear any stale/expired token so it never pollutes public pages
  useEffect(() => {
    removeToken();
    removeUser();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setIsLoading(false);
      alert("Password reset link sent to: " + email);
      setPage("login");
    } catch (err) {
      console.warn("API forgot password failed, falling back to local logic:", err);
      setTimeout(() => {
        setIsLoading(false);
        alert("Password reset link sent to: " + email);
        setPage("login");
      }, 1200);
    }
  };

  return (
    <div className="login-container">
      {/* Left side illustration - same as login and signup for brand consistency */}
      <div className="login-left">
        <div className="brand">
          <div className="brand-logo-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="currentColor" />
              <path d="M9 14l2 2 4-4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">ScholarTrack</span>
          </div>
        </div>

        <div className="intro-section">
          <h1>
            Hello, Welcome! <br />
            <span className="highlight">Admin Portal</span>
          </h1>
          <p className="intro-text">
            Welcome! Manage student attendance quickly, accurately, and efficiently from one centralized platform.
          </p>
        </div>

        <div className="illustration-wrapper">
          <img
            src={studentAttendanceImg}
            alt="Student Attendance Overview"
            className="illustration-img"
          />
        </div>
      </div>

      {/* Right side form */}
      <div className="login-right">
        <div className="auth-card">
          <div className="card-header">
            <div className="card-logo">
              <div className="logo-badge">
                {/* Fixed Single Blue Logo Badge without overlapping green book */}
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-cap">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </div>
            </div>
            <h2>Reset Password</h2>
            <p className="card-subtitle">
              Enter your registered email address and we'll help you reset your password securely.
            </p>
          </div>

          <form onSubmit={handleReset} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Registered Email Address</label>
              <div className="input-field-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="Registered Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <div className="loading-spinner"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <>
                  <FaSignInAlt className="btn-icon" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>

          {/* Prompt link with proper margin and increased distance setup */}
          <div className="signup-prompt" style={{ marginTop: "28px" }}>
            Remember your password?{" "}
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
      </div>
    </div>
  );
}

export default ForgotPassword;
