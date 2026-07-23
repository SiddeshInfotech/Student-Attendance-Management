import React, { useState, useEffect } from "react";
import { FaChartPie, FaSignOutAlt, FaBookOpen, FaUserCircle } from "react-icons/fa";
import "../styles/StudentDashboard.css";
import StudentOverviewTab from "./student-tabs/StudentOverviewTab";
import StudentProfileTab from "./student-tabs/StudentProfileTab";

export default function StudentDashboard({ setPage }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

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

  return (
    <div className="sd-container">
      
      {/* Sidebar */}
      <aside className="sd-sidebar">
        <div className="sd-brand">
          <div className="sd-brand-icon">
             <FaBookOpen size={18} />
          </div>
          <div className="sd-brand-text">
            <h3>ScholarTrack</h3>
            <span>Student Portal</span>
          </div>
        </div>

        <nav className="sd-nav">
          <a
            className={`sd-nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FaChartPie /> Dashboard
          </a>
          <a
            className={`sd-nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FaUserCircle /> Profile
          </a>
        </nav>

        <div style={{ flex: 1 }}></div>

        <button className="sd-logout-btn" onClick={() => setPage("landing")}>
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
