import React, { useState } from "react";
import "../styles/Landing.css";

/* Icons */
const IconShield = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const IconCap = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9l10-4 10 4-10 4L2 9z" />
    <path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" />
    <path d="M22 9v6" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M7.5 12.5l3 3 6-6" />
  </svg>
);
const IconChart = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h4l2 7 4-14 2 7h6" />
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M7 10V7a5 5 0 0110 0v3" />
  </svg>
);
const IconDash = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconBolt = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L4.5 13.5H12L11 22l8.5-11.5H12L13 2z" />
  </svg>
);

const FEATURES = [
  { icon: <IconCheck />, title: "Digital Attendance", text: "Automated and error-free tracking using secure biometric and digital ID verification workflows." },
  { icon: <IconChart />, title: "Real-Time Analytics", text: "Instant access to organizational metrics, historical trends, and predictive behavioral modelling." },
  { icon: <IconLock />, title: "Enterprise Security", text: "State-of-the-art protection featuring end-to-end encryption for all sensitive organizational data." },
  { icon: <IconDash />, title: "Management Dashboard", text: "Centralized workspace for monitoring and control for all profiles across multiple geographical locations." },
  { icon: <IconBolt />, title: "Performance Scalability", text: "Optimized for rapid scaling and low-latency real-time times, supporting thousands of simultaneous events without degradation." },
];

function Landing({ setPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="landing-container">

      {/* ── Navbar ─────────────────────────────── */}
      <nav className="st-nav">
        <div className="st-nav-inner">
          <div className="st-logo">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="currentColor" />
              <path d="M9 14l2 2 4-4" />
            </svg>
            <span>ScholarTrack</span>
          </div>
          <ul className="st-nav-links">
            <li><a href="#solutions">Solutions</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#portals">Portals</a></li>
            <li><a href="#about">About Us</a></li>
          </ul>
          <div className="st-nav-actions">
            <button className="btn-ghost" onClick={() => setPage("login")}>Login</button>
            <button className="btn-primary" onClick={() => setPage("login")}>Book a Demo</button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────── */}
      <section className="st-hero">
        <div className="st-hero-inner">
          <div className="st-badge">✦ ENTERPRISE READY</div>
          <h1 className="st-hero-title">ScholarTrack Management System</h1>
          <p className="st-hero-desc">
            Smart, Secure &amp; Efficient Workforce &amp; Student Management. Experience the future of
            organizational control with our comprehensive, high-performance attendance and reporting engine.
          </p>
          <div className="st-hero-btns">
            <button className="btn-primary btn-lg" onClick={() => setPage("login")}>
              Get Started with Enterprise →
            </button>
            <button className="btn-outline btn-lg">View Documentation</button>
          </div>
          <div className="st-stats">
            <div className="st-stat">
              <span className="st-stat-num">500+</span>
              <span className="st-stat-lbl">ENTERPRISES</span>
            </div>
            <div className="st-stat-divider" />
            <div className="st-stat">
              <span className="st-stat-num">99.9%</span>
              <span className="st-stat-lbl">UPTIME SLA</span>
            </div>
            <div className="st-stat-divider" />
            <div className="st-stat">
              <span className="st-stat-num">1M+</span>
              <span className="st-stat-lbl">USERS TRACKED</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portals ────────────────────────────── */}
      <section className="st-portals" id="portals">
        <div className="st-section-inner">
          <div className="st-section-header">
            <h2>Integrated Access Portals</h2>
            <p>Select your entry point to manage workforce data or view individual performance metrics.</p>
          </div>
          <div className="st-portal-grid">
            <div className="st-portal-card">
              <div className="st-portal-icon">
                <IconShield />
              </div>
              <h3>Organizational Controller</h3>
              <p>Manage students, monitor attendance, generate complete workforce reports and configure instance-wide security settings from a centralized command center.</p>
              <button className="btn-primary btn-portal" onClick={() => setPage("login")}>
                Admin Login &nbsp;→
              </button>
            </div>
            <div className="st-portal-card st-portal-card--alt">
              <div className="st-portal-icon">
                <IconCap />
              </div>
              <h3>Member Portal</h3>
              <p>View your attendance records, manage your professional profile, and access reported academic to organizational details in real-time.</p>
              <button className="btn-outline btn-portal" onClick={() => setPage("student-login")}>
                User Login &nbsp;→
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section className="st-features" id="features">
        <div className="st-section-inner st-features-inner">
          <div className="st-features-left">
            <h2>Why Choose ScholarTrack?</h2>
            <p>Built for high-stakes environments where data precision and reliability are non-negotiable.</p>
            <div className="st-features-img-box">
              <div className="st-features-img-placeholder">
                <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
                  <circle cx="40" cy="40" r="38" stroke="#2563eb" strokeWidth="2" opacity="0.4" />
                  <path d="M40 14l20 8v12c0 10-8 18-20 22C28 52 20 44 20 34V22l20-8z" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
                  <path d="M30 40l7 7 13-14" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span>ScholarTrack</span>
              </div>
            </div>
          </div>
          <div className="st-features-right">
            {FEATURES.map(({ icon, title, text }) => (
              <div className="st-feature-item" key={title}>
                <div className="st-feature-icon">{icon}</div>
                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────── */}
      <section className="st-cta">
        <div className="st-cta-inner">
          <h2>Ready to optimize your workforce management?</h2>
          <p>Join 500+ leading institutions that have transformed their attendance operations with ScholarTrack.</p>
          <div className="st-cta-btns">
            <button className="btn-primary btn-lg" onClick={() => setPage("login")}>Request Corporate Demo</button>
            <button className="btn-outline btn-lg" onClick={() => setPage("login")}>Contact Sales</button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="st-footer">
        <div className="st-footer-inner">
          <div className="st-footer-brand">
            <div className="st-logo">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="currentColor" />
                <path d="M9 14l2 2 4-4" />
              </svg>
              <span>ScholarTrack</span>
            </div>
            <p>Advanced management solutions for modern educational and corporate institutions.</p>
          </div>
          <div className="st-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
            <a href="#">Contact Support</a>
          </div>
          <p className="st-footer-copy">© 2026 ScholarTrack Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
