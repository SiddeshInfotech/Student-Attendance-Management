import React from "react";
import {
  FaUserShield,
  FaUserGraduate,
  FaCheckCircle,
  FaChartLine,
  FaLock,
  FaUsers
} from "react-icons/fa";
import "../styles/Landing.css";
import Tilt from "react-parallax-tilt";

function Landing({ setPage }) {
  return (
    <div className="landing-container">
      {/* Background Video */}
      <div className="video-background-wrapper">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="video-bg"
        >
          {/* A stunning abstract technology network video */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-world-map-in-a-network-31547-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

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

        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">Welcome to the Future of Education</h1>
          <h2 className="hero-subtitle">Smart, Secure & Efficient Attendance Management</h2>
          <p className="hero-description">
            Experience the future of education management. Our platform provides digital attendance
            tracking, real-time analytics, and comprehensive student management all in one secure,
            easy-to-use interface.
          </p>
        </section>

        {/* Portals Section */}
        <section className="portals-section">
          <Tilt className="tilt-wrapper" tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000} scale={1.05} transitionSpeed={2000}>
            <div className="portal-card glass-panel">
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
          </Tilt>

          <Tilt className="tilt-wrapper" tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000} scale={1.05} transitionSpeed={2000}>
            <div className="portal-card glass-panel">
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
          </Tilt>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="features-title">Why Choose Our System?</h2>
          <div className="features-grid">
            <Tilt className="tilt-wrapper-feature" tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02}>
              <div className="feature-item glass-panel">
                <FaCheckCircle className="feature-icon" />
                <div className="feature-text">
                  <h4>Digital Attendance</h4>
                  <p>Quick and error-free attendance marking.</p>
                </div>
              </div>
            </Tilt>
            <Tilt className="tilt-wrapper-feature" tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02}>
              <div className="feature-item glass-panel">
                <FaChartLine className="feature-icon" />
                <div className="feature-text">
                  <h4>Real-Time Reports</h4>
                  <p>Instant access to metrics and history.</p>
                </div>
              </div>
            </Tilt>
            <Tilt className="tilt-wrapper-feature" tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02}>
              <div className="feature-item glass-panel">
                <FaLock className="feature-icon" />
                <div className="feature-text">
                  <h4>Secure Login</h4>
                  <p>State-of-the-art security for user data.</p>
                </div>
              </div>
            </Tilt>
            <Tilt className="tilt-wrapper-feature" tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02}>
              <div className="feature-item glass-panel">
                <FaUsers className="feature-icon" />
                <div className="feature-text">
                  <h4>Student Management</h4>
                  <p>Easily manage student profiles.</p>
                </div>
              </div>
            </Tilt>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>&copy; 2026 ScholarTrack. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Landing;
