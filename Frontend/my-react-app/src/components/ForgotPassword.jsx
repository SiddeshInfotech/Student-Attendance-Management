import { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash, FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import { forgotPassword, resetPassword } from "../services/authService.js";
import { removeToken, removeUser } from "../services/apiClient.js";
import "../styles/ForgotPassword.css";
import studentAttendanceImg from "../assets/images/student_attendance_illustration.png";

function ForgotPassword({ setPage }) {
  const [step, setStep] = useState("request"); // 'request' | 'verify' | 'success'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  // Clear any stale/expired token so it never pollutes public pages
  useEffect(() => {
    removeToken();
    removeUser();
  }, []);

  // Timer countdown for Resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email.trim());
      setStep("verify");
      setTimer(30); // 30s cooldown
    } catch (err) {
      console.error("Forgot password request failed:", err);
      setError(err?.response?.data?.detail || err.message || "Failed to send OTP. Please check your registered email.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP & Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        new_password: newPassword,
      });
      setStep("success");
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0 || isLoading) return;
    setError("");
    setIsLoading(true);
    try {
      await forgotPassword(email.trim());
      setTimer(30);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container forgot-container">
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
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-cap">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </div>
            </div>

            {step === "request" && (
              <>
                <h2>Reset Password</h2>
                <p className="card-subtitle">
                  Enter your registered email address to receive a 6-digit OTP.
                </p>
              </>
            )}

            {step === "verify" && (
              <>
                <h2>Verify OTP</h2>
                <p className="card-subtitle">
                  Enter the 6-digit OTP sent to <strong>{email}</strong>
                </p>
              </>
            )}

            {step === "success" && (
              <>
                <h2>Password Reset</h2>
                <p className="card-subtitle">Your password has been changed successfully.</p>
              </>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div style={{
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

          {/* STEP 1: Enter Email to Send OTP */}
          {step === "request" && (
            <form onSubmit={handleSendOtp} className="login-form">
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
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  <>
                    <FaPaperPlane className="btn-icon" />
                    <span>Send OTP</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Enter OTP & New Password */}
          {step === "verify" && (
            <form onSubmit={handleResetPassword} className="login-form">
              {/* OTP Field */}
              <div className="input-group">
                <label htmlFor="otp">6-Digit OTP</label>
                <div className="input-field-wrapper">
                  <FaKey className="input-icon" />
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    style={{ letterSpacing: "4px", fontWeight: "600", fontSize: "16px" }}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <div className="loading-spinner"></div>
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  <>
                    <FaLock className="btn-icon" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                {timer > 0 ? (
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>
                    Resend OTP in <strong>{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
                  >
                    🔄 Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          {/* SUCCESS STATE */}
          {step === "success" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <FaCheckCircle style={{ fontSize: "56px", color: "#10b981", marginBottom: "16px" }} />
              <p style={{ color: "#374151", fontWeight: "600", fontSize: "16px", margin: "0 0 8px" }}>
                Password Reset Successfully!
              </p>
              <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 24px" }}>
                You can now log in to your account with your new password.
              </p>
              <button
                className="login-submit-btn"
                onClick={() => setPage("login")}
              >
                Go to Login
              </button>
            </div>
          )}

          {/* Prompt link */}
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

