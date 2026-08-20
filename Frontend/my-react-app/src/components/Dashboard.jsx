/**
 * Dashboard.jsx
 * ─────────────────────────────────────────────────────────
 * Main dashboard orchestrator.
 *
 * Features:
 *  - Sidebar navigation
 *  - Common top bar on EVERY tab
 *  - Global Search
 *  - Notifications
 *  - Messages
 *  - Admin Profile menu
 *  - Admin Profile Photo
 *  - Global success/error banner
 *  - Live clock
 *  - Shared attendance store
 *  - Tab routing
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useRef } from "react";

import {
  FaSignOutAlt,
  FaChartLine,
  FaGraduationCap,
  FaUserCheck,
  FaHistory,
  FaFileAlt,
  FaCog,
  FaUserCircle,
  FaCheck,
  FaExclamationTriangle,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaChevronDown,
  FaUser,
  FaCog as FaSettings,
  FaSignOutAlt as FaLogout,
  FaCheckCircle,
  FaChalkboardTeacher,
} from "react-icons/fa";

import { useAttendanceStore } from "../store/useAttendanceStore";

import DashboardTab from "./tabs/DashboardTab";
import StudentsTab from "./tabs/StudentsTab";
import AttendanceTab from "./tabs/AttendanceTab";
import HistoryTab from "./tabs/HistoryTab";
import ReportsTab from "./tabs/ReportsTab";
import SettingsTab from "./tabs/SettingsTab";
import AdminProfileTab from "./tabs/AdminProfileTab";
import settingsService from "../services/settingsService";
import { getUser, getToken } from "../services/apiClient";

import "../styles/Dashboard.css";

// =========================================================
// NAVIGATION ITEMS
// =========================================================

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    Icon: FaChartLine,
  },
  {
    id: "students",
    label: "Students",
    Icon: FaGraduationCap,
  },
  {
    id: "attendance",
    label: "Attendance",
    Icon: FaUserCheck,
  },
  {
    id: "history",
    label: "History",
    Icon: FaHistory,
  },
  {
    id: "reports",
    label: "Reports",
    Icon: FaFileAlt,
  },
  {
    id: "settings",
    label: "Settings",
    Icon: FaCog,
  },
  {
    id: "profile",
    label: "Profile",
    Icon: FaUserCircle,
  },
];

// =========================================================
// DEFAULT ADMIN PROFILE
// =========================================================

const DEFAULT_ADMIN_PROFILE = {
  name: "Admin User",
  role: "Super Admin",
  photo: "",
};

// =========================================================
// GET ADMIN PROFILE
// =========================================================

const getAdminProfile = () => {
  try {
    const saved = localStorage.getItem("sam_admin_profile");

    if (saved) {
      return {
        ...DEFAULT_ADMIN_PROFILE,
        ...JSON.parse(saved),
      };
    }
  } catch (error) {
    console.error(
      "Unable to load admin profile:",
      error
    );
  }

  return DEFAULT_ADMIN_PROFILE;
};

// =========================================================
// COMMON TOP BAR
// =========================================================

function DashboardTopBar({
  activeTab,
  setActiveTab,
  setPage,
  onOpenSidebar,
}) {
  const [searchValue, setSearchValue] =
    useState("");

  const [activeMenu, setActiveMenu] =
    useState(null);

  // -------------------------------------------------------
  // ADMIN PROFILE
  // -------------------------------------------------------

  const [adminProfile, setAdminProfile] =
    useState(getAdminProfile);

  const topBarRef = useRef(null);

  // -------------------------------------------------------
  // REFRESH PROFILE
  // -------------------------------------------------------

  const refreshAdminProfile = useCallback(() => {
    setAdminProfile(getAdminProfile());
  }, []);

  // -------------------------------------------------------
  // Listen for custom profile update event
  // -------------------------------------------------------

  useEffect(() => {
    const handleProfileUpdate = () => {
      refreshAdminProfile();
    };

    window.addEventListener(
      "adminProfileUpdated",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "adminProfileUpdated",
        handleProfileUpdate
      );
    };
  }, [refreshAdminProfile]);

  // -------------------------------------------------------
  // Refresh when profile menu opens
  // -------------------------------------------------------

  useEffect(() => {
    if (activeMenu === "profile") {
      refreshAdminProfile();
    }
  }, [
    activeMenu,
    refreshAdminProfile,
  ]);

  // -------------------------------------------------------
  // Browser storage event
  // -------------------------------------------------------

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        !event.key ||
        event.key === "sam_admin_profile"
      ) {
        refreshAdminProfile();
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [refreshAdminProfile]);

  // -------------------------------------------------------
  // Close dropdown when clicking outside
  // -------------------------------------------------------

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        topBarRef.current &&
        !topBarRef.current.contains(
          event.target
        )
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =======================================================
  // GLOBAL SEARCH
  // =======================================================

  const handleGlobalSearch = (e) => {
    if (e.key !== "Enter") return;

    const query = searchValue
      .trim()
      .toLowerCase();

    if (!query) return;

    if (
      query.includes("student") ||
      query.includes("students") ||
      query.includes("pupil")
    ) {
      setActiveTab("students");
    } else if (
      query.includes("attendance") ||
      query.includes("present") ||
      query.includes("absent")
    ) {
      setActiveTab("attendance");
    } else if (
      query.includes("history") ||
      query.includes("record")
    ) {
      setActiveTab("history");
    } else if (
      query.includes("report") ||
      query.includes("reports")
    ) {
      setActiveTab("reports");
    } else if (
      query.includes("setting") ||
      query.includes("settings")
    ) {
      setActiveTab("settings");
    } else if (
      query.includes("profile") ||
      query.includes("admin")
    ) {
      setActiveTab("profile");
    } else if (
      query.includes("dashboard") ||
      query.includes("home")
    ) {
      setActiveTab("dashboard");
    }

    setSearchValue("");
  };

  // =======================================================
  // NOTIFICATIONS
  // =======================================================

  const handleNotificationClick = () => {
    setActiveMenu(
      activeMenu === "notifications"
        ? null
        : "notifications"
    );
  };

  // =======================================================
  // MESSAGES
  // =======================================================

  const handleMessageClick = () => {
    setActiveMenu(
      activeMenu === "messages"
        ? null
        : "messages"
    );
  };

  // =======================================================
  // PROFILE
  // =======================================================

  const handleProfileClick = () => {
    refreshAdminProfile();

    setActiveMenu(
      activeMenu === "profile"
        ? null
        : "profile"
    );
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      className="global-topbar"
      ref={topBarRef}
    >
      {/* =================================================
          LEFT: HAMBURGER (MOBILE) + SEARCH
          ================================================= */}

      <div className="topbar-left-group">

        <button
          type="button"
          className="topbar-hamburger-btn"
          onClick={onOpenSidebar}
          aria-label="Toggle Navigation Menu"
        >
          <FaBars />
        </button>

        <div className="global-search-wrapper">

          <FaSearch className="global-search-icon" />

          <input
            type="text"
            value={searchValue}
            onChange={(e) =>
              setSearchValue(e.target.value)
            }
            onKeyDown={handleGlobalSearch}
            placeholder="Search for students, teachers, classes..."
            className="global-search-input"
            aria-label="Global Search"
          />

          <span className="search-shortcut">
            Enter
          </span>

          {searchValue.trim() && (
            <button
              className="search-clear-btn"
              onClick={() =>
                setSearchValue("")
              }
              aria-label="Clear Search"
            >
              <FaTimes />
            </button>
          )}

        </div>

      </div>

      {/* =================================================
          RIGHT ACTIONS
          ================================================= */}

      <div className="global-topbar-actions">

        {/* =================================================
            NOTIFICATIONS
            ================================================= */}

        <div className="topbar-action-wrapper">

          <button
            className={`topbar-icon-btn ${activeMenu ===
              "notifications"
              ? "active"
              : ""
              }`}
            onClick={
              handleNotificationClick
            }
            aria-label="Notifications"
          >
            <FaBell />

            <span className="notification-badge">
              3
            </span>
          </button>

          {activeMenu ===
            "notifications" && (
              <div className="topbar-dropdown notification-dropdown">

                <div className="dropdown-header">

                  <div>
                    <h4>
                      Notifications
                    </h4>

                    <span>
                      3 new notifications
                    </span>
                  </div>

                  <button
                    className="dropdown-mark-btn"
                    onClick={() =>
                      setActiveMenu(null)
                    }
                  >
                    Mark all
                  </button>

                </div>

                <div className="notification-list">

                  <div className="notification-item">

                    <div className="notification-item-icon blue">
                      <FaUserCheck />
                    </div>

                    <div className="notification-item-content">

                      <strong>
                        Attendance updated
                      </strong>

                      <p>
                        Today's attendance has been saved.
                      </p>

                      <span>
                        Just now
                      </span>

                    </div>

                  </div>

                  <div className="notification-item">

                    <div className="notification-item-icon green">
                      <FaCheckCircle />
                    </div>

                    <div className="notification-item-content">

                      <strong>
                        Attendance completed
                      </strong>

                      <p>
                        Attendance for Class A is complete.
                      </p>

                      <span>
                        10 min ago
                      </span>

                    </div>

                  </div>

                  <div className="notification-item">

                    <div className="notification-item-icon orange">
                      <FaExclamationTriangle />
                    </div>

                    <div className="notification-item-content">

                      <strong>
                        Low attendance alert
                      </strong>

                      <p>
                        Some students have low attendance.
                      </p>

                      <span>
                        1 hour ago
                      </span>

                    </div>

                  </div>

                </div>

                <button
                  className="dropdown-footer-btn"
                  onClick={() => {
                    setActiveTab("history");
                    setActiveMenu(null);
                  }}
                >
                  View Attendance History
                </button>

              </div>
            )}
        </div>

        {/* =================================================
            MESSAGES
            ================================================= */}

        <div className="topbar-action-wrapper">

          <button
            className={`topbar-icon-btn ${activeMenu === "messages"
              ? "active"
              : ""
              }`}
            onClick={
              handleMessageClick
            }
            aria-label="Messages"
          >
            <FaEnvelope />

            <span className="notification-badge message-badge">
              2
            </span>
          </button>

          {activeMenu ===
            "messages" && (
              <div className="topbar-dropdown message-dropdown">

                <div className="dropdown-header">

                  <div>
                    <h4>
                      Messages
                    </h4>

                    <span>
                      2 unread messages
                    </span>
                  </div>

                </div>

                <div className="message-list">

                  <div className="message-item">

                    <div className="message-avatar">
                      T
                    </div>

                    <div className="message-content">

                      <strong>
                        Teacher
                      </strong>

                      <p>
                        Attendance has been updated.
                      </p>

                      <span>
                        5 min ago
                      </span>

                    </div>

                  </div>

                  <div className="message-item">

                    <div className="message-avatar">
                      A
                    </div>

                    <div className="message-content">

                      <strong>
                        Admin Office
                      </strong>

                      <p>
                        New notice has been added.
                      </p>

                      <span>
                        30 min ago
                      </span>

                    </div>

                  </div>

                </div>

                <button
                  className="dropdown-footer-btn"
                  onClick={() =>
                    setActiveMenu(null)
                  }
                >
                  View All Messages
                </button>

              </div>
            )}
        </div>

        {/* =================================================
            ADMIN PROFILE
            ================================================= */}

        <div className="topbar-profile-wrapper">

          <button
            className={`topbar-profile-btn ${activeMenu === "profile"
              ? "active"
              : ""
              }`}
            onClick={
              handleProfileClick
            }
            aria-label="Admin Profile"
          >

            {/* PROFILE PHOTO */}

            <div className="topbar-profile-avatar">

              {adminProfile?.photo ? (
                <img
                  src={adminProfile.photo}
                  alt="Admin Profile"
                  className="topbar-profile-photo"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";

                    const fallback =
                      e.currentTarget.parentElement.querySelector(
                        ".topbar-profile-fallback"
                      );

                    if (fallback) {
                      fallback.style.display =
                        "block";
                    }
                  }}
                />
              ) : null}

              <FaUserCircle
                className="topbar-profile-fallback"
                style={{
                  display:
                    adminProfile?.photo
                      ? "none"
                      : "block",
                }}
              />

            </div>

            {/* PROFILE NAME */}

            <div className="topbar-profile-info">

              <strong>
                {adminProfile?.name ||
                  "Admin User"}
              </strong>

              <span>
                {adminProfile?.role ||
                  "Super Admin"}
              </span>

            </div>

            <FaChevronDown
              className="profile-chevron"
            />

          </button>

          {/* =================================================
              PROFILE DROPDOWN
              ================================================= */}

          {activeMenu === "profile" && (
            <div className="topbar-dropdown profile-dropdown">

              <div className="profile-dropdown-header">

                <div className="profile-large-avatar">

                  {adminProfile?.photo ? (
                    <img
                      src={
                        adminProfile.photo
                      }
                      alt="Admin Profile"
                      className="profile-dropdown-photo"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";

                        const fallback =
                          e.currentTarget.parentElement.querySelector(
                            ".profile-dropdown-fallback"
                          );

                        if (fallback) {
                          fallback.style.display =
                            "block";
                        }
                      }}
                    />
                  ) : null}

                  <FaUserCircle
                    className="profile-dropdown-fallback"
                    style={{
                      display:
                        adminProfile?.photo
                          ? "none"
                          : "block",
                    }}
                  />

                </div>

                <div>

                  <strong>
                    {adminProfile?.name ||
                      "Admin User"}
                  </strong>

                  <span>
                    {adminProfile?.role ||
                      "Super Admin"}
                  </span>

                </div>

              </div>

              <div className="profile-dropdown-divider" />

              <button
                className="profile-dropdown-item"
                onClick={() => {
                  setActiveTab(
                    "profile"
                  );
                  setActiveMenu(null);
                }}
              >
                <FaUser />

                <span>
                  My Profile
                </span>
              </button>

              <button
                className="profile-dropdown-item"
                onClick={() => {
                  setActiveTab(
                    "settings"
                  );
                  setActiveMenu(null);
                }}
              >
                <FaSettings />

                <span>
                  Settings
                </span>
              </button>

              <button
                className="profile-dropdown-item logout-item"
                onClick={() => {
                  setActiveMenu(null);
                  setPage("landing");
                }}
              >
                <FaLogout />

                <span>
                  Log Out
                </span>
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// =========================================================
// MAIN DASHBOARD
// =========================================================

function Dashboard({ setPage }) {

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [scrollToEnroll, setScrollToEnroll] =
    useState(false);

  const [banner, setBanner] = useState({
    msg: "",
    type: "success",
  });

  const [currentTime, setCurrentTime] =
    useState("");

  const [currentDate, setCurrentDate] =
    useState("");

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  // -------------------------------------------------------
  // Shared settings
  // -------------------------------------------------------

  const [schoolName, setSchoolName] =
    useState(
      "Siddesh Infotech College"
    );

  const [academicYear, setAcademicYear] =
    useState("2024 - 2025");

  // -------------------------------------------------------
  // Auth Guard: Ensure only admin/teachers can view this dashboard
  // -------------------------------------------------------
  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token) {
      setPage("login");
      return;
    }
    const role = (user?.role_name || user?.role?.role_name || user?.role || "").toString().toLowerCase();
    if (role === "student") {
      setPage("student-dashboard");
    }
  }, [setPage]);

  // Load live settings on dashboard initialization
  useEffect(() => {
    const fetchGlobalSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        if (data && data.settings) {
          if (data.settings.college_name) setSchoolName(data.settings.college_name);
          if (data.settings.academic_year) setAcademicYear(data.settings.academic_year);
        }
      } catch (err) {
        // Fallback to local storage
        try {
          const saved = localStorage.getItem("sam_admin_settings");
          if (saved) {
            const s = JSON.parse(saved);
            if (s.college_name || s.collegeName) setSchoolName(s.college_name || s.collegeName);
            if (s.academic_year || s.academicYear) setAcademicYear(s.academic_year || s.academicYear);
          }
        } catch (e) {}
      }
    };
    fetchGlobalSettings();
  }, []);

  // -------------------------------------------------------
  // Central attendance store
  // -------------------------------------------------------

  const store = useAttendanceStore();

  // -------------------------------------------------------
  // TAB CLICK
  // -------------------------------------------------------

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
  };

  // -------------------------------------------------------
  // LIVE CLOCK
  // -------------------------------------------------------

  useEffect(() => {

    const tick = () => {

      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }
        )
      );

      setCurrentDate(
        now.toLocaleDateString(
          "en-IN",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
      );
    };

    tick();

    const id = setInterval(
      tick,
      1000
    );

    return () =>
      clearInterval(id);

  }, []);

  // -------------------------------------------------------
  // SUCCESS / ERROR BANNER
  // -------------------------------------------------------

  const triggerBanner =
    useCallback(
      (msg, type = "success") => {

        setBanner({
          msg,
          type,
        });

        setTimeout(() => {

          setBanner({
            msg: "",
            type: "success",
          });

        }, 4500);
      },
      []
    );

  // -------------------------------------------------------
  // SETTINGS CHANGE
  // -------------------------------------------------------

  const handleSettingsChange =
    useCallback(
      ({
        schoolName: sn,
        academicYear: ay,
      }) => {

        if (sn) {
          setSchoolName(sn);
        }

        if (ay) {
          setAcademicYear(ay);
        }

      },
      []
    );

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="dashboard-container">

      {/* =================================================
          GLOBAL BANNER
          ================================================= */}

      {banner.msg && (
        <div
          className={`success-floating-banner ${banner.type === "error"
            ? "banner-error"
            : ""
            }`}
        >

          {banner.type === "error" ? (
            <FaExclamationTriangle
              className="banner-icon"
            />
          ) : (
            <FaCheck
              className="banner-icon"
            />
          )}

          <span>
            {banner.msg}
          </span>

        </div>
      )}

      {/* =================================================
          MOBILE HEADER
          ================================================= */}

      <header className="mobile-header-bar">

        <button
          className="mobile-hamburger-btn"
          onClick={() =>
            setIsSidebarOpen(
              !isSidebarOpen
            )
          }
          aria-label="Toggle Navigation Menu"
        >
          {isSidebarOpen ? (
            <FaTimes />
          ) : (
            <FaBars />
          )}
        </button>

        <div className="mobile-header-title">

          <h3>
            ScholarTrack
          </h3>

          <span>
            Admin
          </span>

        </div>

      </header>

      {/* =================================================
          SIDEBAR OVERLAY
          ================================================= */}

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setIsSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside
        className={`dashboard-sidebar ${isSidebarOpen
          ? "open"
          : ""
          }`}
      >

        {/* BRAND */}

        <div className="sidebar-brand">

          <div className="sidebar-brand-icon">

            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >

              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />

              <rect
                x="8"
                y="2"
                width="8"
                height="4"
                rx="1"
                ry="1"
                fill="currentColor"
              />

              <path d="M9 14l2 2 4-4" />

            </svg>

          </div>

          <div className="sidebar-brand-text">

            <h3>
              ScholarTrack
            </h3>

            <span>
              Admin Portal
            </span>

          </div>

          <button
            className="sidebar-close-btn"
            onClick={() =>
              setIsSidebarOpen(false)
            }
            aria-label="Close Sidebar"
          >
            <FaTimes />
          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-menu">

          {NAV_ITEMS.map(
            ({
              id,
              label,
              Icon,
            }) => (
              <a
                key={id}
                href="#"
                className={`menu-item ${activeTab === id
                  ? "active"
                  : ""
                  }`}
                onClick={(e) => {

                  e.preventDefault();

                  handleTabClick(id);

                }}
                title={label}
              >

                <Icon className="menu-icon" />

                <span>
                  {label}
                </span>

              </a>
            )
          )}

        </nav>

        {/* LOGOUT */}

        <div className="sidebar-footer">

          <button
            className="logout-btn"
            onClick={() =>
              setPage("landing")
            }
          >

            <FaSignOutAlt />

            <span>
              Log Out
            </span>

          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      {/* =================================================
          MAIN AREA (TOPBAR + SCROLLABLE CONTENT)
          ================================================= */}

      <div className="dashboard-main-area">

        {/* COMMON TOP BAR */}

        <DashboardTopBar
          activeTab={activeTab}
          setActiveTab={
            setActiveTab
          }
          setPage={setPage}
          onOpenSidebar={() =>
            setIsSidebarOpen(
              (prev) => !prev
            )
          }
        />

        {/* =================================================
            MAIN SCROLLABLE CONTENT
            ================================================= */}

        <main className="dashboard-content">

          {/* DASHBOARD */}

          {activeTab ===
            "dashboard" && (
              <DashboardTab
                store={store}
                currentDate={
                  currentDate
                }
                currentTime={
                  currentTime
                }
                setActiveTab={
                  setActiveTab
                }
                setScrollToEnroll={
                  setScrollToEnroll
                }
              />
            )}

          {/* STUDENTS */}

          {activeTab ===
            "students" && (
              <StudentsTab
                store={store}
                triggerBanner={
                  triggerBanner
                }
                scrollToEnroll={
                  scrollToEnroll
                }
                onScrollHandled={() =>
                  setScrollToEnroll(
                    false
                  )
                }
              />
            )}

          {/* ATTENDANCE */}

          {activeTab ===
            "attendance" && (
              <AttendanceTab
                store={store}
                triggerBanner={
                  triggerBanner
                }
              />
            )}

          {/* HISTORY */}

          {activeTab ===
            "history" && (
              <HistoryTab
                store={store}
              />
            )}

          {/* REPORTS */}

          {activeTab ===
            "reports" && (
              <ReportsTab
                store={store}
                schoolName={
                  schoolName
                }
                academicYear={
                  academicYear
                }
                triggerBanner={
                  triggerBanner
                }
              />
            )}

          {/* SETTINGS */}

          {activeTab ===
            "settings" && (
              <SettingsTab
                onSettingsChange={
                  handleSettingsChange
                }
                triggerBanner={
                  triggerBanner
                }
              />
            )}

          {/* PROFILE */}

          {activeTab ===
            "profile" && (
              <AdminProfileTab
                triggerBanner={
                  triggerBanner
                }
                onLogout={() =>
                  setPage("landing")
                }
              />
            )}

        </main>
      </div>
    </div>
  );
}

export default Dashboard;