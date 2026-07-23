import React, { useState, useMemo } from "react";
import { FaPen, FaEnvelope, FaPhoneAlt, FaBell, FaShieldAlt, FaQuestionCircle, FaSignOutAlt, FaChevronRight, FaChevronDown, FaExternalLinkAlt, FaIdBadge, FaUsers, FaCalendarAlt } from "react-icons/fa";
import { useAttendanceStore, todayStr, nDaysAgo } from "../../store/useAttendanceStore";

export default function StudentProfileTab({ currentDate, currentTime }) {
  const store = useAttendanceStore();
  
  const studentId = "s1";
  const student = store.students.find(s => s.id === studentId) || {
    id: "s1", name: "Aarav Sharma", rollNo: "101", grade: "Grade 10", division: "A", phone: "9876543210"
  };

  const summary = useMemo(() => {
    return store.getStudentSummary(student.id, nDaysAgo(364), todayStr());
  }, [store, student.id]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: student.phone || "",
  });

  // Accordion State for settings
  const [activeSetting, setActiveSetting] = useState(null);

  const toggleSetting = (settingName) => {
    if (activeSetting === settingName) {
      setActiveSetting(null);
    } else {
      setActiveSetting(settingName);
    }
  };

  const handleSave = () => {
    store.updateStudent(student.id, { phone: formData.phone });
    setIsEditing(false);
  };

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
        
        <div className="sd-profile-name-large">{student.name}</div>
        <div className="sd-profile-id-large">ID: STU-{student.rollNo}</div>
        <div className="sd-profile-dept-pill">{student.grade} - {student.division}</div>
      </div>

      {/* Stats Row */}
      <div className="sd-profile-stats-row">
        <div className="sd-profile-stat-box">
          <div className="sd-profile-stat-label">ATTENDANCE</div>
          <div className="sd-profile-stat-circle attendance">
             {summary.percentage > 0 ? Math.round(summary.percentage) : 85}%
          </div>
          <div className="sd-profile-stat-sub">Overall Progress</div>
        </div>
        
        <div className="sd-profile-stat-box">
          <div className="sd-profile-stat-label">GPA</div>
          <div className="sd-profile-stat-circle gpa">
             3.8
          </div>
          <div className="sd-profile-stat-sub">Academic Rating</div>
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
               <span style={{ color: "#475569" }}>{student.name}</span>
            </div>
         </div>

         <div className="sd-info-group">
            <span className="sd-info-label">Student ID</span>
            <div className="sd-info-field">
               <FaIdBadge color="#94A3B8" />
               <span style={{ color: "#475569" }}>STU-{student.rollNo}</span>
            </div>
         </div>

         <div className="sd-info-group">
            <span className="sd-info-label">Class & Division</span>
            <div className="sd-info-field">
               <FaUsers color="#94A3B8" />
               <span style={{ color: "#475569" }}>{student.grade} - {student.division}</span>
            </div>
         </div>
         
         <div className="sd-info-group">
            <span className="sd-info-label">Email Address</span>
            <div className="sd-info-field">
               <FaEnvelope color="#94A3B8" />
               <span style={{ color: "#475569" }}>{student.name.split(" ")[0].toLowerCase()}@university.edu</span>
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
                 <span style={{ color: "#475569" }}>+91 {student.phone || "Not set"}</span>
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
         
         <div className="sd-settings-item danger" onClick={() => window.location.href = "/"}>
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
