import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from "react-icons/fa";
import { studentLogin } from "../services/authService.js";
import { removeToken, removeUser } from "../services/apiClient.js";
import "../styles/Login.css";
import studentAttendanceImg from "../assets/images/student_attendance_illustration.png";

function StudentLogin({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Clear any stale/expired token on public pages
  useEffect(() => {
    removeToken();
    removeUser();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await studentLogin({ email, password });
      setIsLoading(false);
      setPage("student-dashboard");
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Invalid email or password. Please try again.");
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
            <span className="brand-title">ScholarTrack</span>
          </div>
        </div>

        <div className="intro-section">
          <h1>
            Hello, Welcome! <br />
            <span className="highlight">Student Portal</span>
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
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-cap">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </div>
            </div>
            <h2>Welcome Back</h2>
            <p className="card-subtitle">Sign in to continue managing student attendance</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="error-alert">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="error-alert-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-field-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-field-wrapper">
                <FaLock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="toggle-icon" />
                  ) : (
                    <FaEye className="toggle-icon" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Remember Me</span>
              </label>
            </div>

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <FaSignInAlt className="btn-icon" />
                  <span>Log In</span>
                </>
              )}
            </button>

            <div className="forgot-password-bottom">
              <a
                href="#"
                className="forgot-password-link"
                onClick={(e) => {
                  e.preventDefault();
                  setPage("student-forgot");
                }}
              >
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
