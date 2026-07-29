import React, { useState, useEffect } from "react";
import { FaChartPie, FaSignOutAlt, FaBookOpen, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { logout } from "../services/authService";
import "../styles/StudentDashboard.css";
import StudentOverviewTab from "./student-tabs/StudentOverviewTab";
import StudentProfileTab from "./student-tabs/StudentProfileTab";

export default function StudentDashboard({ setPage }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="sd-container">

      {/* Mobile Top Header Bar with Hamburger Menu */}
      <header className="sd-mobile-header-bar">
        <button
          className="sd-mobile-hamburger-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="sd-mobile-header-title">
          <h3>ScholarTrack</h3>
          <span>Student</span>
        </div>
      </header>

      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="sd-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sd-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sd-brand">
          <div className="sd-brand-icon">
             <FaBookOpen size={18} />
          </div>
          <div className="sd-brand-text">
            <h3>ScholarTrack</h3>
            <span>Student Portal</span>
          </div>
          <button
            className="sd-sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="sd-nav">
          <a
            className={`sd-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => handleTabClick("overview")}
          >
            <FaChartPie /> Dashboard
          </a>
          <a
            className={`sd-nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => handleTabClick("profile")}
          >
            <FaUserCircle /> Profile
          </a>
        </nav>

        <div style={{ flex: 1 }}></div>

        <button className="sd-logout-btn" onClick={() => { logout(); setPage("landing"); }}>
          <FaSignOutAlt /> Log Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="sd-main">
        {activeTab === "overview" && <StudentOverviewTab currentDate={currentDate} currentTime={currentTime} />}
        {activeTab === "profile"  && <StudentProfileTab currentDate={currentDate} currentTime={currentTime} />}
      </main>

    </div>
  );
}
