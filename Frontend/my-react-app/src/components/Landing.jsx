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
const IconGraduation = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
  </svg>
);
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2M9 18h6" />
  </svg>
);
const IconMobile = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 18h.01" />
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const IconAward = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);
const IconTarget = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const FEATURES = [
  {
    icon: <IconCheck />,
    badge: "AUTOMATED",
    title: "Digital Attendance",
    text: "Automated and error-free tracking using secure biometric and digital ID verification workflows.",
    highlights: ["Biometric verification", "100% Zero-proxy accuracy", "Instant log creation"]
  },
  {
    icon: <IconChart />,
    badge: "ANALYTICS",
    title: "Real-Time Analytics",
    text: "Instant access to organizational metrics, historical trends, and predictive behavioral modelling.",
    highlights: ["Custom report builder", "Attendance percentage graphs", "Export to PDF & Excel"]
  },
  {
    icon: <IconLock />,
    badge: "PROTECTION",
    title: "Enterprise Security",
    text: "State-of-the-art protection featuring end-to-end encryption for all sensitive organizational data.",
    highlights: ["AES-256 data encryption", "Role-based access control", "GDPR & ISO compliant"]
  },
  {
    icon: <IconDash />,
    badge: "COMMAND CENTER",
    title: "Management Dashboard",
    text: "Centralized workspace for monitoring and control across multiple geographical locations.",
    highlights: ["Multi-branch oversight", "Live active user count", "Unified alert stream"]
  },
  {
    icon: <IconBolt />,
    badge: "HIGH SPEED",
    title: "Performance Scalability",
    text: "Optimized for rapid scaling and low-latency real-time sync, supporting thousands of simultaneous events.",
    highlights: ["Sub-second log sync", "Auto-scaling infrastructure", "99.9% uptime SLA"]
  },
  {
    icon: <IconShield />,
    badge: "INTEGRITY",
    title: "Proxy Prevention Engine",
    text: "Advanced anti-proxy algorithms and biometric verification ensuring absolute attendance integrity.",
    highlights: ["Geofence verification", "Biometric cross-check", "Audit-trail logging"]
  }
];

const SOLUTIONS = [
  {
    icon: <IconGraduation />,
    badge: "UNIVERSITIES & COLLEGES",
    title: "Academic Institutions",
    text: "Automated lecture tracking, campus-wide faculty dashboards, and seamlessly integrated student portal access with ERP syncing.",
    features: ["Classroom biometric check-in", "Automated roll-call logs", "SIS & LMS Integration"]
  },
  {
    icon: <IconBuilding />,
    badge: "ENTERPRISE WORKFORCE",
    title: "Corporate Offices",
    text: "Multi-location shift management, biometric turnstile integration, and real-time attendance export for payroll processing.",
    features: ["Shift & overtime tracking", "Multi-branch monitoring", "Payroll automated export"]
  },
  {
    icon: <IconMobile />,
    badge: "HYBRID & REMOTE",
    title: "Smart Mobile Check-In",
    text: "GPS geofenced attendance logging with facial verification for field teams, remote employees, and outdoor events.",
    features: ["GPS geofence radius", "Biometric selfie validation", "Offline sync support"]
  },
  {
    icon: <IconBell />,
    badge: "REAL-TIME ALERTS",
    title: "Automated Notifications",
    text: "Instant SMS, WhatsApp, and email alerts for absenteeism, late entry thresholds, and weekly summary reports.",
    features: ["Instant parent/admin alert", "Customizable threshold rules", "Scheduled PDF reports"]
  }
];

const ABOUT_US = [
  {
    icon: <IconTarget />,
    title: "Mission Driven Precision",
    text: "Engineered to eliminate manual error and proxy attendance through tamper-proof automated tracking for 100% data reliability."
  },
  {
    icon: <IconAward />,
    title: "Enterprise-Grade Trust",
    text: "ISO 27001-certified security standards ensuring confidential student and organizational records remain protected round the clock."
  },
  {
    icon: <IconUsers />,
    title: "User-Centric Experience",
    text: "Thoughtfully crafted interfaces designed for effortless navigation by administrators, educators, and students alike."
  },
  {
    icon: <IconBolt />,
    title: "High Performance Engine",
    text: "Powered by modern cloud infrastructure delivering 99.9% uptime SLA with low-latency real-time synchronization."
  }
];

function Landing({ setPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="landing-container">

      {/* ── Navbar ─────────────────────────────── */}
      <nav className="st-nav">
        <div className="st-nav-inner">
          <div className="st-logo">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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

          <button
            className="st-mobile-menu-btn"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <>
          <div className="st-mobile-menu-overlay" onClick={() => setMobileOpen(false)} />
          <div className={`st-mobile-menu ${mobileOpen ? "open" : ""}`}>
            <ul className="st-mobile-nav-links">
              <li><a href="#solutions" onClick={() => setMobileOpen(false)}>Solutions</a></li>
              <li><a href="#features" onClick={() => setMobileOpen(false)}>Features</a></li>
              <li><a href="#portals" onClick={() => setMobileOpen(false)}>Portals</a></li>
              <li><a href="#about" onClick={() => setMobileOpen(false)}>About Us</a></li>
            </ul>
            <div className="st-mobile-nav-actions">
              <button className="btn-ghost" onClick={() => { setMobileOpen(false); setPage("login"); }}>Login</button>
              <button className="btn-primary" onClick={() => { setMobileOpen(false); setPage("login"); }}>Book a Demo</button>
            </div>
          </div>
        </>
      )}

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

      {/* ── Solutions ───────────────────────────── */}
      <section className="st-solutions" id="solutions">
        <div className="st-section-inner">
          <div className="st-section-header">
            <div className="st-section-tag">TAILORED CAPABILITIES</div>
            <h2>Tailored Solutions for Every Institution</h2>
            <p>Designed to scale across universities, corporate campuses, hybrid teams, and automated alert environments.</p>
          </div>
          <div className="st-solutions-grid">
            {SOLUTIONS.map((sol) => (
              <div className="st-solution-card" key={sol.title}>
                <div className="st-solution-card-top">
                  <div className="st-solution-icon">{sol.icon}</div>
                  <span className="st-sol-badge">{sol.badge}</span>
                </div>
                <h3>{sol.title}</h3>
                <p>{sol.text}</p>
                <ul className="st-solution-features">
                  {sol.features.map((item, idx) => (
                    <li key={idx}>
                      <span className="st-bullet-check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section className="st-features" id="features">
        <div className="st-section-inner">
          <div className="st-section-header">
            <div className="st-section-tag">CORE ENGINE</div>
            <h2>Why Choose ScholarTrack?</h2>
            <p>Built for high-stakes educational &amp; enterprise environments where data precision, security, and absolute reliability are non-negotiable.</p>
          </div>
          <div className="st-features-grid">
            {FEATURES.map((feat) => (
              <div className="st-feature-card" key={feat.title}>
                <div className="st-feature-card-top">
                  <div className="st-feature-icon">{feat.icon}</div>
                  <span className="st-feat-badge">{feat.badge}</span>
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.text}</p>
                <ul className="st-feature-highlights">
                  {feat.highlights.map((item, idx) => (
                    <li key={idx}>
                      <span className="st-bullet-check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portals ────────────────────────────── */}
      <section className="st-portals" id="portals">
        <div className="st-section-inner">
          <div className="st-section-header">
            <div className="st-section-tag">SECURE ACCESS</div>
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

      {/* ── About Us ────────────────────────────── */}
      <section className="st-about" id="about">
        <div className="st-section-inner">
          <div className="st-section-header">
            <div className="st-section-tag">WHO WE ARE</div>
            <h2>About ScholarTrack</h2>
            <p>We empower institutions globally with modern attendance automation, unmatched security, and data-driven insights.</p>
          </div>

          <div className="st-about-grid">
            {ABOUT_US.map((item) => (
              <div className="st-about-card" key={item.title}>
                <div className="st-about-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          <div className="st-about-banner">
            <div className="st-about-banner-content">
              <h3>Trusted by over 500+ Top Institutions</h3>
              <p>From university campuses with 20,000+ students to global enterprises managing remote workforces, ScholarTrack provides seamless operational control.</p>
            </div>
            <div className="st-about-stats-mini">
              <div className="st-mini-stat">
                <span className="st-mini-num">100M+</span>
                <span className="st-mini-lbl">Logs Synced</span>
              </div>
              <div className="st-mini-stat">
                <span className="st-mini-num">99.99%</span>
                <span className="st-mini-lbl">Accuracy Rate</span>
              </div>
            </div>
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
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="currentColor" />
                <path d="M9 14l2 2 4-4" />
              </svg>
              <span>ScholarTrack</span>
            </div>
            <p>Advanced management solutions for modern educational and corporate institutions.</p>
          </div>
          <div className="st-footer-links">
            <a href="#solutions">Solutions</a>
            <a href="#features">Features</a>
            <a href="#portals">Portals</a>
            <a href="#about">About Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="st-footer-bottom">
            <p className="st-footer-copy">© 2026 ScholarTrack Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

