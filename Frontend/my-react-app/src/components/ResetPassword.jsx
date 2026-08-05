import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { resetPassword } from "../services/authService.js";
import "../styles/Login.css";
import studentAttendanceImg from "../assets/images/student_attendance_illustration.png";

function ResetPassword({ setPage, token }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ token, new_password: newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left side illustration */}
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
            <span className="brand-title">Student Attendance</span>
            <span className="brand-subtitle">Management System</span>
          </div>
        </div>

        <div className="intro-section">
          <h1>
            Student Attendance <br />
            <span className="highlight">Management System</span>
          </h1>
          <p className="intro-text">
            Secure your account by setting a new password. Choose something strong and memorable.
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
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-cap">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-book">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
            </div>
            <h2>Set New Password</h2>
            <p className="card-subtitle">
              {success ? "Your password has been reset!" : "Enter and confirm your new password below."}
            </p>
          </div>

          {/* Success State */}
          {success ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <FaCheckCircle style={{ fontSize: "56px", color: "#10b981", marginBottom: "16px" }} />
              <p style={{ color: "#374151", fontWeight: "600", fontSize: "16px", margin: "0 0 8px" }}>
                Password Reset Successfully!
              </p>
              <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 24px" }}>
                You can now log in with your new password.
              </p>
              <button
                className="login-submit-btn"
                onClick={() => setPage("login")}
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="login-form">
              {/* Error message */}
              {error && (
                <div className="error-message" style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  marginBottom: "16px",
                  color: "#dc2626",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  ⚠️ {error}
                </div>
              )}

              {/* New Password */}
              <div className="input-group">
                <label htmlFor="new-password">New Password</label>
                <div className="input-field-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    id="new-password"
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNew(!showNew)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
                  >
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="input-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="input-field-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <FaLock className="btn-icon" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="signup-prompt">
            Remembered your password?{" "}
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

export default ResetPassword;
