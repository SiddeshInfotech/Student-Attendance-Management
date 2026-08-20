import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaChartPie,
  FaSignOutAlt,
  FaBookOpen,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaSearch,
  FaChevronDown,
  FaIdBadge
} from "react-icons/fa";
import "../styles/StudentDashboard.css";
import StudentOverviewTab from "./student-tabs/StudentOverviewTab";
import StudentProfileTab from "./student-tabs/StudentProfileTab";
import { getStudentProfile, logout } from "../services/authService";
import { getUser, getToken } from "../services/apiClient";

const getInitials = (name) => {
  if (!name) return "ST";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

export default function StudentDashboard({ setPage }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Top Bar Search & Profile Dropdown States
  const [searchValue, setSearchValue] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);

  const profileRef = useRef(null);

  // -------------------------------------------------------
  // Auth Guard: Ensure only logged-in students can view this dashboard
  // -------------------------------------------------------
  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token) {
      setPage("student-login");
      return;
    }
    const role = (user?.role_name || user?.role?.role_name || user?.role || "").toString().toLowerCase();
    if (role && role !== "student") {
      setPage("dashboard");
    }
  }, [setPage]);

  // Load student profile
  const fetchProfile = useCallback(async () => {
    try {
      const data = await getStudentProfile();
      if (data) {
        setStudentProfile(data);
      }
    } catch (err) {
      // Fallback to local stored user
      const cached = getUser();
      if (cached) {
        setStudentProfile(cached);
      }
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener("studentProfileUpdated", handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);

    return () => {
      window.removeEventListener("studentProfileUpdated", handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
    };
  }, [fetchProfile]);

  // Live Clock
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

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
  };

  // Search Navigation Logic
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const query = searchValue.trim().toLowerCase();
      if (!query) return;

      if (
        query.includes("profile") ||
        query.includes("account") ||
        query.includes("user") ||
        query.includes("info") ||
        query.includes("password") ||
        query.includes("security") ||
        query.includes("detail") ||
        query.includes("contact") ||
        query.includes("phone") ||
        query.includes("email")
      ) {
        setActiveTab("profile");
      } else if (
        query.includes("dash") ||
        query.includes("overview") ||
        query.includes("home") ||
        query.includes("attend") ||
        query.includes("present") ||
        query.includes("absent") ||
        query.includes("stat") ||
        query.includes("chart") ||
        query.includes("calendar") ||
        query.includes("report")
      ) {
        setActiveTab("overview");
      } else {
        // Default to overview for general queries
        setActiveTab("overview");
      }

      setSearchValue("");
    }
  };

  const handleLogout = async () => {
    await logout();
    setPage("landing");
  };

  const studentName = studentProfile?.full_name || studentProfile?.name || "Student";
  const studentRoll = studentProfile?.roll_number || studentProfile?.roll_no || studentProfile?.rollNo || "";
  const studentPhoto = studentProfile?.profile_image || "";
  const studentEmail = studentProfile?.email || "";

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
          <span>Student Portal</span>
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

        <button className="sd-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Log Out
        </button>
      </aside>

      {/* Main Area: Top Bar + Scrollable Content */}
      <div className="sd-main-area">

        {/* Global Student Top Bar */}
        <header className="sd-global-topbar">
          <div className="sd-topbar-left-group">
            <button
              type="button"
              className="topbar-hamburger-btn"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
            >
              <FaBars />
            </button>

            {/* Working Global Search Bar */}
            <div className="sd-global-search-wrapper">
              <FaSearch className="sd-global-search-icon" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search dashboard, attendance, profile, settings... (Press Enter)"
                className="sd-global-search-input"
                aria-label="Search tabs"
              />
              {searchValue.trim() && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchValue("")}
                  aria-label="Clear Search"
                  style={{
                    position: "absolute",
                    right: "12px",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer"
                  }}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Top Bar Actions & Profile Dropdown */}
          <div className="sd-global-topbar-actions" ref={profileRef} style={{ position: "relative" }}>
            <button
              type="button"
              className="sd-topbar-profile-btn"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-expanded={isProfileOpen}
              aria-label="User profile menu"
            >
              <div className="sd-topbar-profile-avatar">
                {studentPhoto ? (
                  <img
                    src={studentPhoto}
                    alt={studentName}
                    className="sd-topbar-profile-photo"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="sd-topbar-profile-fallback">
                    {getInitials(studentName)}
                  </div>
                )}
              </div>

              <div className="sd-topbar-profile-info">
                <strong>{studentName}</strong>
                <span>{studentRoll ? `Roll: ${studentRoll}` : "Student"}</span>
              </div>

              <FaChevronDown
                className="sd-profile-chevron"
                style={{
                  transform: isProfileOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease"
                }}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="topbar-dropdown" style={{ display: "block" }}>
                <div className="profile-dropdown-header">
                  <div className="profile-large-avatar">
                    {studentPhoto ? (
                      <img src={studentPhoto} alt={studentName} />
                    ) : (
                      <div className="profile-dropdown-fallback">
                        {getInitials(studentName)}
                      </div>
                    )}
                  </div>
                  <div>
                    <strong>{studentName}</strong>
                    <span>{studentEmail || (studentRoll ? `Roll No: ${studentRoll}` : "Student Portal")}</span>
                  </div>
                </div>

                <div className="profile-dropdown-divider"></div>

                <div className="profile-dropdown-list">
                  <button
                    type="button"
                    className="profile-dropdown-item"
                    onClick={() => handleTabClick("profile")}
                  >
                    <FaUserCircle size={16} />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    className="profile-dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="sd-main">
          {activeTab === "overview" && <StudentOverviewTab currentDate={currentDate} currentTime={currentTime} />}
          {activeTab === "profile" && <StudentProfileTab currentDate={currentDate} currentTime={currentTime} />}
        </main>

      </div>

    </div>
  );
}

