import { useState } from "react";
import "./AdminProfileTab.css";

import {
  FaUserCircle,
  FaEdit,
  FaSave,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaIdBadge,
  FaBuilding,
  FaClock,
  FaCalendarAlt,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaDownload,
  FaCheckCircle,
  FaCog,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminProfileTab({ triggerBanner, onLogout }) {
  const defaultProfile = {
    name: "Admin User",
    email: "admin@abccollege.edu.in",
    phone: "+91 98765 43210",
    role: "Super Admin",
    employeeId: "ADM001",
    department: "Administration",
    dob: "15 August 1990",
    gender: "Male",
    address: "ABC College Campus, City, State - 400001",
    photo: "",
  };

  // ============================================
  // LOAD PROFILE FROM LOCAL STORAGE
  // ============================================
  const getSavedProfile = () => {
    try {
      const saved = localStorage.getItem("sam_admin_profile");

      if (saved) {
        return {
          ...defaultProfile,
          ...JSON.parse(saved),
        };
      }
    } catch (error) {
      console.error("Unable to load profile:", error);
    }

    return defaultProfile;
  };

  const [profile, setProfile] = useState(getSavedProfile);

  const [isEditing, setIsEditing] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  // ============================================
  // PROFILE INPUT CHANGE
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================
  // PASSWORD CHANGE
  // ============================================
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================
  // SAVE PROFILE
  // ============================================
  const handleSave = () => {
    try {
      localStorage.setItem(
        "sam_admin_profile",
        JSON.stringify(profile)
      );

      window.dispatchEvent(
        new Event("adminProfileUpdate"))

      setIsEditing(false);

      if (triggerBanner) {
        triggerBanner("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Unable to save profile:", error);

      if (triggerBanner) {
        triggerBanner(
          "Unable to save profile!",
          "error"
        );
      }
    }
  };

  // ============================================
  // CANCEL EDIT
  // ============================================
  const handleCancel = () => {
    setProfile(getSavedProfile());
    setIsEditing(false);
  };

  // ============================================
  // PASSWORD SAVE
  // ============================================
  const handlePasswordSave = () => {
    if (
      !password.current ||
      !password.newPassword ||
      !password.confirm
    ) {
      triggerBanner?.(
        "Please fill all password fields!",
        "error"
      );
      return;
    }

    if (password.newPassword !== password.confirm) {
      triggerBanner?.(
        "New passwords do not match!",
        "error"
      );
      return;
    }

    setPassword({
      current: "",
      newPassword: "",
      confirm: "",
    });

    setShowPassword(false);

    triggerBanner?.(
      "Password changed successfully!"
    );
  };

  // ============================================
  // LOGOUT
  // ============================================
  const handleLogoutClick = () => {
    if (
      window.confirm(
        "Are you sure you want to log out?"
      )
    ) {
      if (onLogout) {
        onLogout();
      } else {
        localStorage.removeItem("sam_token");
        localStorage.removeItem("sam_user");
        window.location.reload();
      }
    }
  };

  return (
    <>
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <header className="content-header">
        <div className="header-welcome">
          <h2>My Profile</h2>

          <p className="header-date">
            Dashboard &nbsp;›&nbsp; Profile
          </p>
        </div>

        <div className="header-action-group">
          {!isEditing ? (
            <>
              <button
                className="primary-action-btn"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>

              <button
                className="profile-header-logout-btn"
                onClick={handleLogoutClick}
                title="Log Out of System"
              >
                <FaSignOutAlt />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <button
                className="secondary-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                className="primary-action-btn"
                onClick={handleSave}
              >
                <FaSave />
                <span>Save Changes</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* =====================================================
          PROFILE PAGE
      ====================================================== */}

      <section className="profile-page">

        {/* =================================================
            TOP SECTION
        ================================================== */}

        <div className="profile-top">

          {/* =================================================
              PROFILE CARD
          ================================================== */}

          <div className="profile-card bg-glass">

            <div className="profile-avatar-wrapper">

              <div className="profile-avatar">

                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="Admin Profile"
                    className="admin-profile-photo"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";

                      const fallback =
                        e.currentTarget.parentElement.querySelector(
                          ".default-profile-icon"
                        );

                      if (fallback) {
                        fallback.style.display =
                          "block";
                      }
                    }}
                  />
                ) : null}

                <FaUserCircle
                  className="default-profile-icon"
                  style={{
                    display: profile.photo
                      ? "none"
                      : "block",
                  }}
                />

              </div>

            </div>

            <h2>
              {profile?.name || "Admin User"}
            </h2>

            <span className="role-badge">
              {profile?.role || "Super Admin"}
            </span>

            <div className="profile-info-list">

              <div className="profile-info-item">
                <FaIdBadge />

                <span>Employee ID</span>

                <strong>
                  {profile?.employeeId || "ADM001"}
                </strong>
              </div>

              <div className="profile-info-item">
                <FaBuilding />

                <span>Department</span>

                <strong>
                  {profile?.department ||
                    "Administration"}
                </strong>
              </div>

              <div className="profile-info-item">
                <FaEnvelope />

                <span>Email</span>

                <strong>
                  {profile?.email ||
                    "admin@abccollege.edu.in"}
                </strong>
              </div>

              <div className="profile-info-item">
                <FaPhone />

                <span>Phone</span>

                <strong>
                  {profile?.phone ||
                    "+91 98765 43210"}
                </strong>
              </div>

              <div className="profile-info-item">
                <FaClock />

                <span>Last Login</span>

                <strong>
                  14 Aug 2026, 10:30 AM
                </strong>
              </div>

            </div>

            <button
              type="button"
              className="profile-card-logout-btn"
              onClick={handleLogoutClick}
            >
              <FaSignOutAlt />
              <span>Log Out Account</span>
            </button>

          </div>

          {/* =================================================
              EDIT PROFILE
          ================================================== */}

          <div className="edit-profile-card bg-glass">

            <div className="section-title-row">

              <h3>Edit Profile</h3>

              <button
                className="change-password-btn"
                onClick={() =>
                  setShowPassword(true)
                }
              >
                <FaLock />
                Change Password
              </button>

            </div>

            <div className="profile-form-grid">

              {/* PROFILE PHOTO URL */}

              <div className="profile-field full-width">

                <label>
                  Profile Photo URL
                </label>

                <input
                  type="url"
                  name="photo"
                  value={profile.photo || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://example.com/admin-photo.jpg"
                />

                <small className="field-help">
                  Paste a direct image URL and click
                  Save Changes.
                </small>

                {/* PHOTO PREVIEW */}

                {isEditing &&
                  profile.photo && (
                    <div className="profile-photo-preview">

                      <img
                        src={profile.photo}
                        alt="Preview"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                    </div>
                  )}

              </div>

              {/* FULL NAME */}

              <div className="profile-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

              </div>

              {/* EMPLOYEE ID */}

              <div className="profile-field">

                <label>
                  Employee ID
                </label>

                <input
                  type="text"
                  value={profile.employeeId}
                  disabled
                />

              </div>

              {/* EMAIL */}

              <div className="profile-field">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

              </div>

              {/* DATE OF BIRTH */}

              <div className="profile-field">

                <label>
                  Date of Birth
                </label>

                <input
                  type="text"
                  name="dob"
                  value={profile.dob}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

              </div>

              {/* PHONE */}

              <div className="profile-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

              </div>

              {/* GENDER */}

              <div className="profile-field">

                <label>
                  Gender
                </label>

                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

              </div>

              {/* DEPARTMENT */}

              <div className="profile-field">

                <label>
                  Department
                </label>

                <select
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option>
                    Administration
                  </option>

                  <option>
                    Computer Engineering
                  </option>

                  <option>
                    Information Technology
                  </option>

                  <option>
                    Mechanical Engineering
                  </option>

                  <option>
                    Civil Engineering
                  </option>
                </select>

              </div>

              {/* ADDRESS */}

              <div className="profile-field">

                <label>
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            BOTTOM SECTION
        ================================================== */}

        <div className="profile-bottom">

          {/* ACCOUNT INFORMATION */}

          <div className="account-card bg-glass">

            <div className="card-heading">
              <h3>Account Information</h3>
            </div>

            <div className="account-list">

              <div>
                <span>
                  <FaShieldAlt />
                  Account Type
                </span>

                <strong className="purple-badge">
                  Super Admin
                </strong>
              </div>

              <div>
                <span>
                  <FaUserShield />
                  Username
                </span>

                <strong>
                  admin
                </strong>
              </div>

              <div>
                <span>
                  <FaCalendarAlt />
                  Member Since
                </span>

                <strong>
                  01 January 2024
                </strong>
              </div>

              <div>
                <span>
                  <FaCheckCircle />
                  Status
                </span>

                <strong className="success-badge">
                  Active
                </strong>
              </div>

              <div>
                <span>
                  <FaEnvelope />
                  Email
                </span>

                <strong className="success-badge">
                  Verified
                </strong>
              </div>

              <div>
                <span>
                  <FaLock />
                  Two-Factor Authentication
                </span>

                <strong className="disabled-badge">
                  Disabled
                </strong>
              </div>

            </div>
          </div>

          {/* RECENT ACTIVITY */}

          <div className="activity-card bg-glass">

            <div className="card-heading">

              <h3>
                Recent Activity
              </h3>

              <button
                className="view-all-btn"
                onClick={() =>
                  triggerBanner?.(
                    "Showing all activities"
                  )
                }
              >
                View All
              </button>

            </div>

            <div className="activity-list">

              <div className="activity-item">

                <div className="activity-icon success">
                  <FaCheckCircle />
                </div>

                <div>
                  <strong>
                    Logged in to the system
                  </strong>

                  <p>
                    14 Aug 2026, 10:30 AM
                  </p>
                </div>

                <span className="activity-status success-badge">
                  Success
                </span>

              </div>

              <div className="activity-item">

                <div className="activity-icon info">
                  <FaEdit />
                </div>

                <div>
                  <strong>
                    Updated profile information
                  </strong>

                  <p>
                    13 Aug 2026, 04:15 PM
                  </p>
                </div>

                <span className="activity-status info-badge">
                  Info
                </span>

              </div>

              <div className="activity-item">

                <div className="activity-icon warning">
                  <FaCog />
                </div>

                <div>
                  <strong>
                    Changed system settings
                  </strong>

                  <p>
                    12 Aug 2026, 11:20 AM
                  </p>
                </div>

                <span className="activity-status info-badge">
                  Info
                </span>

              </div>

              <div className="activity-item">

                <div className="activity-icon purple">
                  <FaLock />
                </div>

                <div>
                  <strong>
                    Changed password
                  </strong>

                  <p>
                    10 Aug 2026, 09:10 AM
                  </p>
                </div>

                <span className="activity-status info-badge">
                  Info
                </span>

              </div>

            </div>
          </div>

          {/* QUICK ACTIONS */}

          <div className="quick-actions-card bg-glass">

            <div className="card-heading">
              <h3>
                Quick Actions
              </h3>
            </div>

            <button
              onClick={() =>
                setShowPassword(true)
              }
            >
              <FaLock />
              <span>
                Change Password
              </span>
              <b>›</b>
            </button>

            <button
              onClick={() =>
                triggerBanner?.(
                  "Manage sessions opened"
                )
              }
            >
              <FaUserShield />
              <span>
                Manage Sessions
              </span>
              <b>›</b>
            </button>

            <button
              onClick={() =>
                triggerBanner?.(
                  "Notification preferences opened"
                )
              }
            >
              <FaBell />
              <span>
                Notification Preferences
              </span>
              <b>›</b>
            </button>

            <button
              onClick={() =>
                triggerBanner?.(
                  "Privacy settings opened"
                )
              }
            >
              <FaShieldAlt />
              <span>
                Privacy Settings
              </span>
              <b>›</b>
            </button>

            <button
              onClick={() =>
                triggerBanner?.(
                  "Your data download started"
                )
              }
            >
              <FaDownload />
              <span>
                Download My Data
              </span>
              <b>›</b>
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          PASSWORD MODAL
      ====================================================== */}

      {showPassword && (
        <div className="password-modal-overlay">

          <div className="password-modal">

            <div className="modal-header">

              <h3>
                Change Password
              </h3>

              <button
                onClick={() =>
                  setShowPassword(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            <div className="password-form">

              <div className="profile-field">

                <label>
                  Current Password
                </label>

                <input
                  type="password"
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                />

              </div>

              <div className="profile-field">

                <label>
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={password.newPassword}
                  onChange={handlePasswordChange}
                />

              </div>

              <div className="profile-field">

                <label>
                  Confirm New Password
                </label>

                <input
                  type="password"
                  name="confirm"
                  value={password.confirm}
                  onChange={handlePasswordChange}
                />

              </div>

            </div>

            <div className="modal-actions">

              <button
                className="secondary-btn"
                onClick={() =>
                  setShowPassword(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-action-btn"
                onClick={handlePasswordSave}
              >
                <FaSave />
                Update Password
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default AdminProfileTab;