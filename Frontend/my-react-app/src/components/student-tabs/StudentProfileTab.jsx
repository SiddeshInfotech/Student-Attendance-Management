import React, { useState, useEffect } from "react";
import {
  FaPen,
  FaEnvelope,
  FaPhoneAlt,
  FaBell,
  FaShieldAlt,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronDown,
  FaExternalLinkAlt,
  FaIdBadge,
  FaUsers,
  FaCalendarAlt,
  FaLock,
  FaSpinner,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import { getStudentProfile, updateStudentProfile, changeStudentPassword, logout } from "../../services/authService";

export default function StudentProfileTab({ currentDate, currentTime }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profile_image: ""
  });

  // Password Modal/Form State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Accordion State for settings
  const [activeSetting, setActiveSetting] = useState(null);

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getStudentProfile();
      setProfile(data);
      setFormData({
        name: data.name || data.full_name || "",
        email: data.email || "",
        phone: data.phone_number || data.mobile || "",
        profile_image: data.profile_image || ""
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(err.message || "Failed to load student profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const toggleSetting = (settingName) => {
    setActiveSetting(activeSetting === settingName ? null : settingName);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await updateStudentProfile({
        full_name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        profile_image: formData.profile_image
      });
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
      await loadProfile();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordData.new_password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setChangingPassword(true);
    try {
      await changeStudentPassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      setPasswordSuccess("Password changed successfully!");
      setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1500);
    } catch (err) {
      setPasswordError(err.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "350px", color: "#3b82f6" }}>
        <FaSpinner className="sd-spinner" size={32} style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ marginTop: "1rem", color: "#64748b" }}>Fetching student profile from database...</p>
      </div>
    );
  }

  const studentName = profile?.name || profile?.full_name || "Student";
  const rollNo = profile?.roll_number || profile?.rollNo || "N/A";
  const className = profile?.class_name || profile?.grade || "10th";
  const divisionName = profile?.division_name || profile?.division || "A";
  const attendanceRate = profile?.attendance_percentage ?? 0;
  const gpa = profile?.gpa ?? 3.80;

  return (
    <div className="sd-profile-layout">
      {/* Header Bar */}
      <div className="sd-header" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <h1 className="sd-header-title">Student Profile</h1>
          <p style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", margin: 0, fontSize: "1rem" }}>
            <FaCalendarAlt />
            <span>{currentDate}</span>
            <span style={{ fontWeight: 600, color: "#3b82f6", marginLeft: "0.5rem" }}>{currentTime}</span>
          </p>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: "0.85rem 1rem", background: "#dcfce7", color: "#166534", borderRadius: "8px", marginBottom: "1rem", fontWeight: 500 }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div style={{ padding: "0.85rem 1rem", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "1rem", fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Top Profile Card */}
      <div className="sd-main-profile-card">
        <div className="sd-profile-avatar-large">
          <img src={profile?.profile_image || "https://i.pravatar.cc/150?img=11"} alt="Profile Avatar" />
          <div className="sd-edit-avatar-btn" title="Change Avatar" onClick={() => setIsEditing(true)}>
            <FaPen size={12} />
          </div>
        </div>

        <div className="sd-profile-name-large">{studentName}</div>
        <div className="sd-profile-id-large">ID: STU-{rollNo}</div>
        <div className="sd-profile-dept-pill">{className} - Division {divisionName}</div>
      </div>

      {/* Dynamic Stats Row */}
      <div className="sd-profile-stats-row">
        <div className="sd-profile-stat-box">
          <div className="sd-profile-stat-label">ATTENDANCE</div>
          <div className="sd-profile-stat-circle attendance">
            {Math.round(attendanceRate)}%
          </div>
          <div className="sd-profile-stat-sub">Database Record</div>
        </div>

        <div className="sd-profile-stat-box">
          <div className="sd-profile-stat-label">GPA</div>
          <div className="sd-profile-stat-circle gpa">
            {gpa}
          </div>
          <div className="sd-profile-stat-sub">Academic Rating</div>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="sd-section-header">
        <div className="sd-section-title">Personal Information</div>
        {isEditing ? (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="sd-link-btn" onClick={handleSaveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="sd-link-btn" onClick={() => setIsEditing(false)} style={{ color: "#64748b" }}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="sd-link-btn" onClick={() => setIsEditing(true)}>
            Edit <FaExternalLinkAlt size={12} style={{ marginLeft: "2px" }} />
          </button>
        )}
      </div>

      <div className="sd-info-card">
        <div className="sd-info-group">
          <span className="sd-info-label">Full Name</span>
          <div className="sd-info-field">
            <FaIdBadge color="#94A3B8" />
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ border: "1px solid #cbd5e1", borderRadius: "4px", padding: "4px 8px", width: "100%", outline: "none" }}
              />
            ) : (
              <span style={{ color: "#475569" }}>{studentName}</span>
            )}
          </div>
        </div>

        <div className="sd-info-group">
          <span className="sd-info-label">Student ID / Roll Number</span>
          <div className="sd-info-field">
            <FaIdBadge color="#94A3B8" />
            <span style={{ color: "#475569" }}>STU-{rollNo}</span>
          </div>
        </div>

        <div className="sd-info-group">
          <span className="sd-info-label">Class & Division</span>
          <div className="sd-info-field">
            <FaUsers color="#94A3B8" />
            <span style={{ color: "#475569" }}>{className} - Division {divisionName}</span>
          </div>
        </div>

        <div className="sd-info-group">
          <span className="sd-info-label">Email Address</span>
          <div className="sd-info-field">
            <FaEnvelope color="#94A3B8" />
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ border: "1px solid #cbd5e1", borderRadius: "4px", padding: "4px 8px", width: "100%", outline: "none" }}
              />
            ) : (
              <span style={{ color: "#475569" }}>{profile?.email}</span>
            )}
          </div>
        </div>

        <div className="sd-info-group">
          <span className="sd-info-label">Phone Number</span>
          <div className="sd-info-field">
            <FaPhoneAlt color="#94A3B8" />
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ border: "1px solid #cbd5e1", borderRadius: "4px", padding: "4px 8px", width: "100%", outline: "none" }}
              />
            ) : (
              <span style={{ color: "#475569" }}>{profile?.phone_number || profile?.mobile || "Not set"}</span>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="sd-info-group">
            <span className="sd-info-label">Profile Image URL</span>
            <div className="sd-info-field">
              <input
                type="text"
                placeholder="https://..."
                value={formData.profile_image}
                onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                style={{ border: "1px solid #cbd5e1", borderRadius: "4px", padding: "4px 8px", width: "100%", outline: "none" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Settings & Security */}
      <div className="sd-section-header">
        <div className="sd-section-title">Settings & Security</div>
      </div>

      <div className="sd-settings-list">
        {/* Password Change Item */}
        <div>
          <div className="sd-settings-item" onClick={() => setShowPasswordModal(!showPasswordModal)}>
            <div className="sd-settings-left">
              <FaLock size={18} color="#64748B" />
              <span>Change Password</span>
            </div>
            {showPasswordModal ? <FaChevronDown size={14} color="#CBD5E1" /> : <FaChevronRight size={14} color="#CBD5E1" />}
          </div>
          {showPasswordModal && (
            <div className="sd-settings-content">
              <form onSubmit={handleChangePassword} className="sd-settings-content-inner" style={{ gap: "0.75rem" }}>
                {passwordError && (
                  <div style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: 500 }}>{passwordError}</div>
                )}
                {passwordSuccess && (
                  <div style={{ color: "#10b981", fontSize: "0.85rem", fontWeight: 500 }}>{passwordSuccess}</div>
                )}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#475569", marginBottom: "4px" }}>Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#475569", marginBottom: "4px" }}>New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#475569", marginBottom: "4px" }}>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={changingPassword}
                  style={{ marginTop: "0.5rem", padding: "0.6rem 1.2rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}
                >
                  {changingPassword ? "Updating Password..." : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <div>
          <div className="sd-settings-item" onClick={() => toggleSetting('notifications')}>
            <div className="sd-settings-left">
              <FaBell size={18} color="#64748B" />
              <span>Notification Preferences</span>
            </div>
            {activeSetting === 'notifications' ? <FaChevronDown size={14} color="#CBD5E1" /> : <FaChevronRight size={14} color="#CBD5E1" />}
          </div>
          {activeSetting === 'notifications' && (
            <div className="sd-settings-content">
              <div className="sd-settings-content-inner">
                <div className="sd-toggle-row">
                  <span>Email Alerts for Absences</span>
                  <label className="sd-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="sd-slider"></span>
                  </label>
                </div>
                <div className="sd-toggle-row">
                  <span>Daily Attendance Summaries</span>
                  <label className="sd-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="sd-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Settings */}
        <div>
          <div className="sd-settings-item" onClick={() => toggleSetting('privacy')}>
            <div className="sd-settings-left">
              <FaShieldAlt size={18} color="#64748B" />
              <span>Privacy & Security</span>
            </div>
            {activeSetting === 'privacy' ? <FaChevronDown size={14} color="#CBD5E1" /> : <FaChevronRight size={14} color="#CBD5E1" />}
          </div>
          {activeSetting === 'privacy' && (
            <div className="sd-settings-content">
              <div className="sd-settings-content-inner">
                <div className="sd-toggle-row">
                  <span>Keep Attendance Records Private</span>
                  <label className="sd-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="sd-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Support & Help */}
        <div>
          <div className="sd-settings-item" onClick={() => toggleSetting('support')}>
            <div className="sd-settings-left">
              <FaQuestionCircle size={18} color="#64748B" />
              <span>Support & Help</span>
            </div>
            {activeSetting === 'support' ? <FaChevronDown size={14} color="#CBD5E1" /> : <FaChevronRight size={14} color="#CBD5E1" />}
          </div>
          {activeSetting === 'support' && (
            <div className="sd-settings-content">
              <div className="sd-settings-content-inner">
                <p style={{ margin: 0, fontSize: "0.85rem" }}>Need help with your attendance records or account details? Contact your administrator.</p>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="sd-settings-item danger" onClick={logout}>
          <div className="sd-settings-left">
            <FaSignOutAlt size={18} />
            <span>Logout</span>
          </div>
          <FaChevronRight size={14} color="#CBD5E1" />
        </div>
      </div>
    </div>
  );
}
