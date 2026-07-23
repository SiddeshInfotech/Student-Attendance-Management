/**
 * Dashboard.jsx
 * ─────────────────────────────────────────────────────────
 * Slim orchestrator component. Manages:
 *  - Sidebar navigation
 *  - Global success/error banner
 *  - Live clock
 *  - Shared store (useAttendanceStore)
 *  - Tab routing to modular sub-components
 *
 * Tabs:
 *   dashboard  → DashboardTab
 *   students   → StudentsTab
 *   attendance → AttendanceTab
 *   history    → HistoryTab
 *   reports    → ReportsTab
 *   settings   → SettingsTab
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import {
  FaSignOutAlt,
  FaChartLine,
  FaGraduationCap,
  FaUserCheck,
  FaHistory,
  FaFileAlt,
  FaCog,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

import { useAttendanceStore } from "../store/useAttendanceStore";
import DashboardTab  from "./tabs/DashboardTab";
import StudentsTab   from "./tabs/StudentsTab";
import AttendanceTab from "./tabs/AttendanceTab";
import HistoryTab    from "./tabs/HistoryTab";
import ReportsTab    from "./tabs/ReportsTab";
import SettingsTab   from "./tabs/SettingsTab";

import "../styles/Dashboard.css";

// ── Nav items ─────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",  Icon: FaChartLine   },
  { id: "students",   label: "Students",   Icon: FaGraduationCap },
  { id: "attendance", label: "Attendance", Icon: FaUserCheck   },
  { id: "history",    label: "History",    Icon: FaHistory     },
  { id: "reports",    label: "Reports",    Icon: FaFileAlt     },
  { id: "settings",   label: "Settings",   Icon: FaCog         },
];

function Dashboard({ setPage }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [banner, setBanner]       = useState({ msg: "", type: "success" });
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // Shared settings (for PDF headers)
  const [schoolName,   setSchoolName]   = useState("Siddesh Infotech High School");
  const [academicYear, setAcademicYear] = useState("2026-27");

  // Central data store
  const store = useAttendanceStore();

  // ── Live clock ───────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setCurrentDate(
        now.toLocaleDateString("en-IN", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Success / Error Banner ───────────────────────────────
  const triggerBanner = useCallback((msg, type = "success") => {
    setBanner({ msg, type });
    setTimeout(() => setBanner({ msg: "", type: "success" }), 4500);
  }, []);

  // ── Settings change callback ─────────────────────────────
  const handleSettingsChange = useCallback(({ schoolName: sn, academicYear: ay }) => {
    if (sn) setSchoolName(sn);
    if (ay) setAcademicYear(ay);
  }, []);

  return (
    <div className="dashboard-container">

      {/* ── Global Banner ─────────────────────────────────── */}
      {banner.msg && (
        <div className={`success-floating-banner ${banner.type === "error" ? "banner-error" : ""}`}>
          {banner.type === "error"
            ? <FaExclamationTriangle className="banner-icon" />
            : <FaCheck className="banner-icon" />
          }
          <span>{banner.msg}</span>
        </div>
      )}

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className="dashboard-sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="currentColor" />
              <path d="M9 14l2 2 4-4" />
            </svg>
          </div>
          <div className="sidebar-brand-text">
            <h3>ScholarTrack</h3>
            <span>Admin Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-menu">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <a
              key={id}
              href="#"
              className={`menu-item ${activeTab === id ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); setActiveTab(id); }}
              title={label}
            >
              <Icon className="menu-icon" />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => setPage("landing")}>
            <FaSignOutAlt />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────── */}
      <main className="dashboard-content">
        {activeTab === "dashboard" && (
          <DashboardTab
            store={store}
            currentDate={currentDate}
            currentTime={currentTime}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "students" && (
          <StudentsTab
            store={store}
            triggerBanner={triggerBanner}
          />
        )}

        {activeTab === "attendance" && (
          <AttendanceTab
            store={store}
            triggerBanner={triggerBanner}
          />
        )}

        {activeTab === "history" && (
          <HistoryTab store={store} />
        )}

        {activeTab === "reports" && (
          <ReportsTab
            store={store}
            schoolName={schoolName}
            academicYear={academicYear}
            triggerBanner={triggerBanner}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            onSettingsChange={handleSettingsChange}
            triggerBanner={triggerBanner}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
