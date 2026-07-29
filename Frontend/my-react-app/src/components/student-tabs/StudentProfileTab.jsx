import React, { useState, useEffect } from "react";
import { FaPen, FaEnvelope, FaPhoneAlt, FaBell, FaShieldAlt, FaQuestionCircle, FaSignOutAlt, FaChevronRight, FaChevronDown, FaExternalLinkAlt, FaIdBadge, FaUsers, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import { getMyStudentProfile } from "../../services/authService";
import { getUser, removeToken, removeUser } from "../../services/apiClient";

export default function StudentProfileTab({ currentDate, currentTime }) {
  const loggedInUser = getUser();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ phone: "" });
  const [activeSetting, setActiveSetting] = useState(null);

  // Fetch real profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getMyStudentProfile();
        setProfile(data);
        setFormData({ phone: data.mobile || "" });
      } catch (err) {
        console.warn("Failed to fetch student profile:", err);
        setError("Could not load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const toggleSetting = (settingName) => {
    setActiveSetting(activeSetting === settingName ? null : settingName);
  };

  const handleSave = () => {
    // TODO: API call to update profile
    setIsEditing(false);
  };

  const handleLogout = () => {
    removeToken();
    removeUser();
    window.location.href = "/";
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "12px", color: "#3b82f6" }}>
        <FaSpinner style={{ fontSize: "24px", animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: "16px", fontWeight: 500 }}>Loading profile...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#ef4444" }}>
        <p style={{ fontSize: "16px", fontWeight: 500 }}>{error}</p>
      </div>
    );
  }

  const studentName = profile?.full_name || loggedInUser?.full_name || "Student";
  const rollNumber = profile?.roll_number || "N/A";
  const email = profile?.email || loggedInUser?.email || "N/A";
  const mobile = profile?.mobile || "N/A";
  const className = profile?.class_name || "Not Assigned";
  const department = profile?.department || "Not Assigned";
  const branch = profile?.branch || "Not Assigned";
  const attendancePercentage = profile?.attendance?.percentage || 0;

  return (
    <div className="sd-profile-layout">
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
      
      {/* Top Profile Card */}
      <div className="sd-main-profile-card">
        <div className="sd-profile-avatar-large">
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile Avatar" />
          <div className="sd-edit-avatar-btn">
             <FaPen size={12} />
          </div>
        </div>
        
        <div className="sd-profile-name-large">{studentName}</div>
        <div className="sd-profile-id-large">ID: {rollNumber}</div>
        <div className="sd-profile-dept-pill">{className}{department !== "Not Assigned" ? ` • ${department}` : ""}</div>
      </div>

      {/* Stats Row */}
      <div className="sd-profile-stats-row">
        <div className="sd-profile-stat-box">
          <div className="sd-profile-stat-label">ATTENDANCE</div>
          <div className="sd-profile-stat-circle attendance">
             {attendancePercentage > 0 ? Math.round(attendancePercentage) : 0}%
          </div>
          <div className="sd-profile-stat-sub">Overall Progress</div>
        </div>
        
        <div className="sd-profile-stat-box">
          <div className="sd-profile-stat-label">PRESENT</div>
          <div className="sd-profile-stat-circle gpa">
             {profile?.attendance?.present_days || 0}
          </div>
          <div className="sd-profile-stat-sub">Total Present Days</div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="sd-section-header">
         <div className="sd-section-title">Personal Information</div>
         {isEditing ? (
            <button className="sd-link-btn" onClick={handleSave}>Save</button>
         ) : (
            <button className="sd-link-btn" onClick={() => setIsEditing(true)}>
              Edit <FaExternalLinkAlt size={12} style={{marginLeft: "2px"}}/>
            </button>
         )}
      </div>
      
      <div className="sd-info-card">
         <div className="sd-info-group">
            <span className="sd-info-label">Full Name</span>
            <div className="sd-info-field">
               <FaIdBadge color="#94A3B8" />
               <span style={{ color: "#475569" }}>{studentName}</span>
            </div>
         </div>

         <div className="sd-info-group">
            <span className="sd-info-label">Roll Number</span>
            <div className="sd-info-field">
               <FaIdBadge color="#94A3B8" />
               <span style={{ color: "#475569" }}>{rollNumber}</span>
            </div>
         </div>

         <div className="sd-info-group">
            <span className="sd-info-label">Class & Department</span>
            <div className="sd-info-field">
               <FaUsers color="#94A3B8" />
               <span style={{ color: "#475569" }}>{className}{department !== "Not Assigned" ? ` — ${department}` : ""}</span>
            </div>
         </div>

         <div className="sd-info-group">
            <span className="sd-info-label">Branch</span>
            <div className="sd-info-field">
               <FaUsers color="#94A3B8" />
               <span style={{ color: "#475569" }}>{branch}</span>
            </div>
         </div>
         
         <div className="sd-info-group">
            <span className="sd-info-label">Email Address</span>
            <div className="sd-info-field">
               <FaEnvelope color="#94A3B8" />
               <span style={{ color: "#475569" }}>{email}</span>
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
                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   style={{ border: "none", background: "transparent", outline: "none", fontSize: "0.95rem", width: "100%" }}
                 />
               ) : (
                 <span style={{ color: "#475569" }}>+91 {mobile}</span>
               )}
            </div>
         </div>
      </div>

      {/* Settings & Security */}
      <div className="sd-section-header">
         <div className="sd-section-title">Settings & Security</div>
      </div>
      
      <div className="sd-settings-list">
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
                   <span>Daily Class Reminders</span>
                   <label className="sd-switch">
                     <input type="checkbox" />
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
                 <span>Privacy Settings</span>
              </div>
              {activeSetting === 'privacy' ? <FaChevronDown size={14} color="#CBD5E1" /> : <FaChevronRight size={14} color="#CBD5E1" />}
           </div>
           {activeSetting === 'privacy' && (
             <div className="sd-settings-content">
               <div className="sd-settings-content-inner">
                 <div className="sd-toggle-row">
                   <span>Show Profile to Classmates</span>
                   <label className="sd-switch">
                     <input type="checkbox" defaultChecked />
                     <span className="sd-slider"></span>
                   </label>
                 </div>
                 <button onClick={() => alert("Password reset link sent to your registered email!")} style={{marginTop: "0.5rem", padding: "0.5rem", background: "#EFF6FF", color: "#1D4ED8", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500}}>
                   Change Password
                 </button>
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
                 <p style={{margin: 0, fontSize: "0.85rem"}}>Having trouble with the portal? Reach out to your administration team for assistance.</p>
                 <button onClick={() => alert("Redirecting to IT Support portal...")} style={{marginTop: "0.5rem", padding: "0.5rem", background: "#F1F5F9", color: "#475569", border: "1px solid #E2E8F0", borderRadius: "6px", cursor: "pointer", fontWeight: 500}}>
                   Contact IT Support
                 </button>
               </div>
             </div>
           )}
         </div>
         
         <div className="sd-settings-item danger" onClick={handleLogout}>
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
