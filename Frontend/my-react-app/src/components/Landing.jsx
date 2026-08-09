import React, { useState } from "react";
import "../styles/Landing.css";

const Landing = ({ setPage }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenus = () => {
    setLoginOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className="landing-container">

      {/* ================= NAVBAR ================= */}
      <nav className="st-nav">
        <div className="st-nav-inner">

          {/* Logo */}
          <a href="#home" className="st-logo" onClick={closeMenus}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M8 2v4M16 2v4M3 10h18" />
              <path d="M8 14h2M14 14h2M8 18h2M14 18h2" />
            </svg>

            <span>ScholarTrack</span>
          </a>

          {/* Desktop Navigation */}
          <ul className="st-nav-links">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#solutions">Solutions</a>
            </li>
            <li>
              <a href="#portals">Portals</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
          </ul>

          {/* Desktop Actions */}
          <div className="st-nav-actions">

            {/* Login Dropdown */}
            <div className="login-dropdown-wrapper">

              {loginOpen && (
                <div
                  className="dropdown-backdrop"
                  onClick={() => setLoginOpen(false)}
                />
              )}

              <button
                className={`btn-primary login-trigger-btn ${loginOpen ? "active" : ""
                  }`}
                onClick={() => setLoginOpen(!loginOpen)}
              >
                Login
                <span className="dropdown-caret">▼</span>
              </button>

              {loginOpen && (
                <div className="login-dropdown-menu">

                  <div className="dropdown-menu-header">
                    Select Portal
                  </div>

                  {/* Admin Login */}
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      closeMenus();
                      setPage("login");
                    }}
                  >
                    <div className="dropdown-item-icon admin">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </svg>
                    </div>

                    <div className="dropdown-item-text">
                      <span className="dropdown-item-title">
                        Admin Login
                      </span>
                      <span className="dropdown-item-sub">
                        Access admin dashboard
                      </span>
                    </div>
                  </button>

                  {/* Admin Signup */}
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      closeMenus();
                      setPage("signup");
                    }}
                  >
                    <div className="dropdown-item-icon admin-signup">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <path d="M20 8v6M17 11h6" />
                      </svg>
                    </div>

                    <div className="dropdown-item-text">
                      <span className="dropdown-item-title">
                        Admin Register
                      </span>
                      <span className="dropdown-item-sub">
                        Create administrator account
                      </span>
                    </div>
                  </button>

                  {/* Student Login */}
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      closeMenus();
                      setPage("student-login");
                    }}
                  >
                    <div className="dropdown-item-icon student">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </svg>
                    </div>

                    <div className="dropdown-item-text">
                      <span className="dropdown-item-title">
                        Student Login
                      </span>
                      <span className="dropdown-item-sub">
                        Access student dashboard
                      </span>
                    </div>
                  </button>

                  {/* Student Register */}
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      closeMenus();
                      setPage("student-signup");
                    }}
                  >
                    <div className="dropdown-item-icon student-register">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="9" cy="8" r="4" />
                        <path d="M2 21a7 7 0 0 1 14 0" />
                        <path d="M19 8v6M16 11h6" />
                      </svg>
                    </div>

                    <div className="dropdown-item-text">
                      <span className="dropdown-item-title">
                        Student Register
                      </span>
                      <span className="dropdown-item-sub">
                        Create student account
                      </span>
                    </div>
                  </button>

                </div>
              )}
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                setPage("student-signup");
              }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="st-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <>
          <div
            className="st-mobile-menu-overlay"
            style={{ display: "block" }}
            onClick={closeMenus}
          />

          <div className="st-mobile-menu open">

            <ul className="st-mobile-nav-links">
              <li>
                <a href="#home" onClick={closeMenus}>
                  Home
                </a>
              </li>

              <li>
                <a href="#solutions" onClick={closeMenus}>
                  Solutions
                </a>
              </li>

              <li>
                <a href="#portals" onClick={closeMenus}>
                  Portals
                </a>
              </li>

              <li>
                <a href="#features" onClick={closeMenus}>
                  Features
                </a>
              </li>

              <li>
                <a href="#about" onClick={closeMenus}>
                  About Us
                </a>
              </li>
            </ul>

            <div className="st-mobile-nav-actions">

              <button
                className="btn-primary"
                onClick={() => {
                  setPage("login");
                }}
              >
                Admin Login
              </button>

              <button
                className="btn-ghost"
                onClick={() => {
                  setPage("student-login");
                }}
              >
                Student Login
              </button>

              <button
                className="btn-primary"
                onClick={() => {
                  setPage("student-signup");
                }}
              >
                Get Started
              </button>

            </div>
          </div>
        </>
      )}

      {/* ================= HERO ================= */}
      <section className="st-hero" id="home">
        <div className="st-hero-inner">

          <div className="st-badge">
            STUDENT ATTENDANCE MANAGEMENT SYSTEM
          </div>

          <h1 className="st-hero-title">
            Simplify Attendance & Empower Education
          </h1>

          <p className="st-hero-desc">
            A modern student attendance management system platform designed
            to simplify attendance tracking, student management,
            reporting and academic administration.
          </p>

          <div className="st-hero-btns">

            <button
              className="btn-primary btn-lg"
              onClick={() => {
                setPage("student-signup");
              }}
            >
              Get Started
            </button>

            <a
              href="#solutions"
              className="btn-outline btn-lg"
              style={{ textDecoration: "none" }}
            >
              Explore Features
            </a>

          </div>

          <div className="st-stats">

            <div className="st-stat">
              <span className="st-stat-num">100%</span>
              <span className="st-stat-lbl">
                Digital
              </span>
            </div>

            <div className="st-stat-divider" />

            <div className="st-stat">
              <span className="st-stat-num">24/7</span>
              <span className="st-stat-lbl">
                Accessible
              </span>
            </div>

            <div className="st-stat-divider" />

            <div className="st-stat">
              <span className="st-stat-num">Smart</span>
              <span className="st-stat-lbl">
                Reporting
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SOLUTIONS ================= */}
      <section className="st-solutions" id="solutions">
        <div className="st-section-inner">

          <div className="st-section-header">
            <span className="st-section-tag">
              Solutions
            </span>

            <h2>
              Everything You Need
            </h2>

            <p>
              Powerful tools that make attendance management
              simple, organized and efficient.
            </p>
          </div>

          <div className="st-solutions-grid">

            <div className="st-solution-card">
              <div className="st-solution-card-top">
                <div className="st-solution-icon">
                  📋
                </div>

                <span className="st-sol-badge">
                  Admin
                </span>
              </div>

              <h3>
                Student Management
              </h3>

              <p>
                Manage student records, profiles, classes and
                academic information from one centralized system.
              </p>

              <ul className="st-solution-features">
                <li>
                  <span className="st-bullet-check">✓</span>
                  Student Profiles
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  Class Management
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  Search & Filter
                </li>
              </ul>
            </div>

            <div className="st-solution-card">
              <div className="st-solution-card-top">
                <div className="st-solution-icon">
                  📊
                </div>

                <span className="st-sol-badge">
                  Tracking
                </span>
              </div>

              <h3>
                Attendance Tracking
              </h3>

              <p>
                Record and monitor daily attendance with an
                easy-to-use and reliable attendance system.
              </p>

              <ul className="st-solution-features">
                <li>
                  <span className="st-bullet-check">✓</span>
                  Daily Attendance
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  Attendance History
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  Attendance Percentage
                </li>
              </ul>
            </div>

            <div className="st-solution-card">
              <div className="st-solution-card-top">
                <div className="st-solution-icon">
                  📈
                </div>

                <span className="st-sol-badge">
                  Reports
                </span>
              </div>

              <h3>
                Reports & Analytics
              </h3>

              <p>
                Get clear insights through daily, weekly,
                monthly and student-specific attendance reports.
              </p>

              <ul className="st-solution-features">
                <li>
                  <span className="st-bullet-check">✓</span>
                  Daily Reports
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  Monthly Reports
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  PDF & Excel Export
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ================= PORTALS ================= */}
      <section className="st-portals" id="portals">
        <div className="st-section-inner">

          <div className="st-section-header">
            <span className="st-section-tag">
              Portals
            </span>

            <h2>
              One Platform. Two Powerful Portals.
            </h2>

            <p>
              Dedicated experiences for administrators and students.
            </p>
          </div>

          <div className="st-portal-grid">

            {/* Admin Portal */}
            <div className="st-portal-card">

              <div className="st-portal-icon">
                👨‍💼
              </div>

              <h3>
                Admin Portal
              </h3>

              <p>
                Manage students, attendance records, reports,
                notifications and overall academic data from
                a centralized admin dashboard.
              </p>

              <button
                className="btn-primary btn-portal"
                onClick={() => {
                  setPage("login");
                }}
              >
                Admin Login →
              </button>

            </div>

            {/* Student Portal */}
            <div className="st-portal-card st-portal-card--alt">

              <div className="st-portal-icon">
                🎓
              </div>

              <h3>
                Student Portal
              </h3>

              <p>
                Students can view their profile, attendance
                percentage, attendance history, notifications
                and personal academic information.
              </p>

              <button
                className="btn-primary btn-portal"
                onClick={() => {
                  setPage("student-login");
                }}
              >
                Student Login →
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="st-features" id="features">
        <div className="st-section-inner">

          <div className="st-section-header">
            <span className="st-section-tag">
              Features
            </span>

            <h2>
              Built for Modern Education
            </h2>

            <p>
              Everything required to manage attendance
              efficiently and securely.
            </p>
          </div>

          <div className="st-features-grid">

            <div className="st-feature-card">
              <div className="st-feature-card-top">
                <div className="st-feature-icon">
                  🔐
                </div>

                <span className="st-feat-badge">
                  Security
                </span>
              </div>

              <h3>
                Secure Authentication
              </h3>

              <p>
                Secure login and account management for
                administrators and students.
              </p>

              <ul className="st-feature-highlights">
                <li>
                  <span className="st-bullet-check">✓</span>
                  Login & Registration
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  Password Management
                </li>
              </ul>
            </div>

            <div className="st-feature-card">
              <div className="st-feature-card-top">
                <div className="st-feature-icon">
                  📱
                </div>

                <span className="st-feat-badge">
                  Responsive
                </span>
              </div>

              <h3>
                Responsive Design
              </h3>

              <p>
                Access the system comfortably across desktop,
                tablet and mobile devices.
              </p>

              <ul className="st-feature-highlights">
                <li>
                  <span className="st-bullet-check">✓</span>
                  Mobile Friendly
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  Modern Interface
                </li>
              </ul>
            </div>

            <div className="st-feature-card">
              <div className="st-feature-card-top">
                <div className="st-feature-icon">
                  📄
                </div>

                <span className="st-feat-badge">
                  Export
                </span>
              </div>

              <h3>
                Smart Reports
              </h3>

              <p>
                Generate meaningful attendance reports and
                export important data whenever required.
              </p>

              <ul className="st-feature-highlights">
                <li>
                  <span className="st-bullet-check">✓</span>
                  PDF Reports
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  Excel Reports
                </li>
              </ul>
            </div>

            <div className="st-feature-card">
              <div className="st-feature-card-top">
                <div className="st-feature-icon">
                  🔔
                </div>

                <span className="st-feat-badge">
                  Updates
                </span>
              </div>

              <h3>
                Notifications
              </h3>

              <p>
                Keep students informed about important
                attendance and academic updates.
              </p>

              <ul className="st-feature-highlights">
                <li>
                  <span className="st-bullet-check">✓</span>
                  Real-time Updates
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  Read Notifications
                </li>
              </ul>
            </div>

            <div className="st-feature-card">
              <div className="st-feature-card-top">
                <div className="st-feature-icon">
                  📅
                </div>

                <span className="st-feat-badge">
                  Attendance
                </span>
              </div>

              <h3>
                Attendance History
              </h3>

              <p>
                Quickly review attendance records by date,
                student or class.
              </p>

              <ul className="st-feature-highlights">
                <li>
                  <span className="st-bullet-check">✓</span>
                  Date-wise Records
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  Student-wise Records
                </li>
              </ul>
            </div>

            <div className="st-feature-card">
              <div className="st-feature-card-top">
                <div className="st-feature-icon">
                  ⚡
                </div>

                <span className="st-feat-badge">
                  Efficient
                </span>
              </div>

              <h3>
                Easy Management
              </h3>

              <p>
                A clean and simple interface designed to
                reduce manual work and save time.
              </p>

              <ul className="st-feature-highlights">
                <li>
                  <span className="st-bullet-check">✓</span>
                  Simple Dashboard
                </li>
                <li>
                  <span className="st-bullet-check">✓</span>
                  Fast Access
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="st-about" id="about">
        <div className="st-section-inner">

          <div className="st-section-header">
            <span className="st-section-tag">
              About Us
            </span>

            <h2>
              Making Attendance Management Smarter
            </h2>

            <p>
              Designed to simplify academic attendance
              management through technology.
            </p>
          </div>

          <div className="st-about-grid">

            <div className="st-about-card">
              <div className="st-about-icon">
                🎯
              </div>

              <h3>
                Our Mission
              </h3>

              <p>
                To provide educational institutions with a
                reliable and efficient digital attendance
                management solution.
              </p>
            </div>

            <div className="st-about-card">
              <div className="st-about-icon">
                💡
              </div>

              <h3>
                Our Vision
              </h3>

              <p>
                To make academic management simpler through
                modern technology, automation and meaningful data.
              </p>
            </div>

            <div className="st-about-card">
              <div className="st-about-icon">
                🚀
              </div>

              <h3>
                Our Approach
              </h3>

              <p>
                We focus on simplicity, usability, security
                and scalable solutions for educational needs.
              </p>
            </div>

          </div>

          <div className="st-about-banner">

            <div className="st-about-banner-content">
              <h3>
                A Complete Attendance Solution
              </h3>

              <p>
                From student registration to attendance tracking,
                reports and notifications, everything is managed
                from one connected platform.
              </p>
            </div>

            <div className="st-about-stats-mini">

              <div className="st-mini-stat">
                <span className="st-mini-num">
                  2
                </span>

                <span className="st-mini-lbl">
                  Portals
                </span>
              </div>

              <div className="st-mini-stat">
                <span className="st-mini-num">
                  24/7
                </span>

                <span className="st-mini-lbl">
                  Access
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="st-cta">
        <div className="st-cta-inner">

          <h2>
            Ready to Simplify Attendance Management?
          </h2>

          <p>
            Start managing attendance smarter with a modern,
            secure and easy-to-use platform.
          </p>

          <div className="st-cta-btns">

            <button
              className="btn-primary btn-lg"
              onClick={() => {
                setPage("student-signup");
              }}
            >
              Get Started
            </button>

            <button
              className="btn-outline btn-lg"
              onClick={() => {
                setPage("login");
              }}
            >
              Admin Login
            </button>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="st-footer">

        <div className="st-footer-inner">

          <div className="st-footer-brand">

            <a href="#home" className="st-logo">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M8 2v4M16 2v4M3 10h18" />
                <path d="M8 14h2M14 14h2M8 18h2M14 18h2" />
              </svg>

              <span>ScholarTrack</span>
            </a>

            <p>
              A modern student attendance management platform
              built to make academic administration simpler,
              smarter and more efficient.
            </p>

          </div>

          <div className="st-footer-links">
            <a href="#home">Home</a>
            <a href="#solutions">Solutions</a>
            <a href="#portals">Portals</a>
            <a href="#features">Features</a>
            <a href="#about">About Us</a>
          </div>

          <div className="st-footer-bottom">

            <p className="st-footer-copy">
              © {new Date().getFullYear()} Attendify. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default Landing;