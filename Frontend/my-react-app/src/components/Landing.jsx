import React from "react";
import {
  FaUserShield,
  FaUserGraduate,
  FaCheckCircle,
  FaChartLine,
  FaLock,
  FaUsers,
  FaChartPie,
  FaBolt
} from "react-icons/fa";
import "../styles/Landing.css";
import studentAttendanceImg from "../assets/images/student_attendance_illustration.png";

function Landing({ setPage }) {
  return (
    <div className="landing-container">
      <div className="landing-split">
        {/* Left Content Side */}
        <div className="landing-left">
          <div className="landing-content">
            {/* Brand Logo */}
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
                <span className="brand-subtitle">Attendance System</span>
              </div>
            </div>

            <section className="hero-section">
              <h1 className="hero-title">ScholarTrack <br /> Management System</h1>
              <h2 className="hero-subtitle">Smart, Secure & Efficient Attendance Management</h2>
              <p className="hero-description">
                Experience the future of education management. Our platform provides digital attendance
                tracking, real-time analytics, and comprehensive student management all in one secure,
                easy-to-use interface.
              </p>
            </section>

            <section className="portals-section">
              <div className="portal-card">
                <FaUserShield className="portal-icon admin-icon" />
                <h3>Admin Portal</h3>
                <p>Manage students, monitor attendance, generate reports, and configure system settings.</p>
                <button
                  className="portal-btn admin-btn"
                  onClick={() => setPage("login")}
                >
                  Admin Login
                </button>
              </div>

              <div className="portal-card">
                <FaUserGraduate className="portal-icon student-icon" />
                <h3>Student Portal</h3>
                <p>View your attendance records, personal profile, and important academic details.</p>
                <button
                  className="portal-btn student-btn"
                  onClick={() => setPage("student-login")}
                >
                  Student Login
                </button>
              </div>
            </section>

            <section className="features-section">
              <h2 className="features-title">Why Choose Our System?</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <FaCheckCircle className="feature-icon" />
                  <div className="feature-text">
                    <h4>Digital Attendance</h4>
                    <p>Quick and error-free attendance marking.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaChartLine className="feature-icon" />
                  <div className="feature-text">
                    <h4>Real-Time Reports</h4>
                    <p>Instant access to metrics and history.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaLock className="feature-icon" />
                  <div className="feature-text">
                    <h4>Secure Login</h4>
                    <p>State-of-the-art security for user data.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaUsers className="feature-icon" />
                  <div className="feature-text">
                    <h4>Student Management</h4>
                    <p>Easily manage student profiles.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaChartPie className="feature-icon" />
                  <div className="feature-text">
                    <h4>Analytics Dashboard</h4>
                    <p>Visual insights to track progress.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaBolt className="feature-icon" />
                  <div className="feature-text">
                    <h4>Fast Performance</h4>
                    <p>Optimized for speed and reliability.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Right Image Side */}
        <div className="landing-right">
          <img
            src={studentAttendanceImg}
            alt="Student Attendance Illustration"
            className="landing-img"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 ScholarTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;
