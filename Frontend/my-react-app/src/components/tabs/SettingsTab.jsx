/**
 * SettingsTab.jsx
 * ─────────────────────────────────────────────────────────
 * System settings tab — extracted from the original Dashboard.jsx.
 * All settings persist to localStorage.
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect } from "react";
import {
  FaUniversity, FaClock, FaSms, FaSave, FaServer,
  FaEnvelope,
} from "react-icons/fa";

const SETTINGS_KEY = "sam_settings";

const defaultSettings = {
  schoolName:    "Siddesh Infotech High School",
  academicYear:  "2026-27",
  lateThreshold: "09:00 AM",
  gracePeriod:   "15 Minutes",
  minAttendance: "75%",
  smsGateway:    "twilio",
  smsTemplate:   "Dear Parent, your child {name} has been marked ABSENT in today's attendance register. - ScholarTrack Admin",
  emailAlerts:   true,
  smsAlerts:     true,
};

function SettingsTab({ onSettingsChange, triggerBanner }) {
  const [schoolName,    setSchoolName]    = useState(defaultSettings.schoolName);
  const [academicYear,  setAcademicYear]  = useState(defaultSettings.academicYear);
  const [lateThreshold, setLateThreshold] = useState(defaultSettings.lateThreshold);
  const [gracePeriod,   setGracePeriod]   = useState(defaultSettings.gracePeriod);
  const [minAttendance, setMinAttendance] = useState(defaultSettings.minAttendance);
  const [smsGateway,    setSmsGateway]    = useState(defaultSettings.smsGateway);
  const [smsTemplate,   setSmsTemplate]   = useState(defaultSettings.smsTemplate);
  const [emailAlerts,   setEmailAlerts]   = useState(defaultSettings.emailAlerts);
  const [smsAlerts,     setSmsAlerts]     = useState(defaultSettings.smsAlerts);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const s = JSON.parse(saved);
        setSchoolName(s.schoolName       ?? defaultSettings.schoolName);
        setAcademicYear(s.academicYear   ?? defaultSettings.academicYear);
        setLateThreshold(s.lateThreshold ?? defaultSettings.lateThreshold);
        setGracePeriod(s.gracePeriod     ?? defaultSettings.gracePeriod);
        setMinAttendance(s.minAttendance ?? defaultSettings.minAttendance);
        setSmsGateway(s.smsGateway       ?? defaultSettings.smsGateway);
        setSmsTemplate(s.smsTemplate     ?? defaultSettings.smsTemplate);
        setEmailAlerts(s.emailAlerts     ?? defaultSettings.emailAlerts);
        setSmsAlerts(s.smsAlerts         ?? defaultSettings.smsAlerts);
        if (onSettingsChange) onSettingsChange({ schoolName: s.schoolName, academicYear: s.academicYear });
      }
    } catch { /* ignore */ }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const settings = {
      schoolName, academicYear, lateThreshold, gracePeriod,
      minAttendance, smsGateway, smsTemplate, emailAlerts, smsAlerts,
    };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch { /* ignore */ }
    if (onSettingsChange) onSettingsChange({ schoolName, academicYear });
    triggerBanner("System configurations saved successfully!");
  };

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="content-header">
        <div className="header-welcome">
          <h2>System Configurations</h2>
          <p className="header-date">Manage portal properties, alert thresholds, and notification rules</p>
        </div>
      </header>

      <form onSubmit={handleSave} className="settings-form">

        {/* ── Section 1: Institutional Profile ─────────────── */}
        <div className="settings-tab-layout bg-glass">
          <div className="settings-header">
            <FaUniversity className="settings-header-icon" />
            <div>
              <h3>Institutional Profile</h3>
              <p>Configuration fields shown on generated PDF reports</p>
            </div>
          </div>
          <div className="settings-form-grid">
            <div className="modal-input-group">
              <label>Institution Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
            </div>
            <div className="modal-input-group">
              <label>Current Academic Session</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* ── Section 2: Timing Regulations ────────────────── */}
        <div className="settings-tab-layout bg-glass">
          <div className="settings-header">
            <FaClock className="settings-header-icon" style={{ color: "#f59e0b" }} />
            <div>
              <h3>Attendance Limits &amp; Timing</h3>
              <p>Define thresholds and minimum attendance requirements</p>
            </div>
          </div>
          <div className="settings-form-grid">
            <div className="modal-input-group">
              <label>Late Arrival Mark Time</label>
              <select value={lateThreshold} onChange={(e) => setLateThreshold(e.target.value)}>
                <option value="08:45 AM">08:45 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="09:15 AM">09:15 AM</option>
                <option value="09:30 AM">09:30 AM</option>
              </select>
            </div>
            <div className="modal-input-group">
              <label>Grace Period Limit</label>
              <select value={gracePeriod} onChange={(e) => setGracePeriod(e.target.value)}>
                <option value="5 Minutes">5 Minutes</option>
                <option value="10 Minutes">10 Minutes</option>
                <option value="15 Minutes">15 Minutes</option>
                <option value="30 Minutes">30 Minutes</option>
              </select>
            </div>
            <div className="modal-input-group">
              <label>Minimum Attendance Required</label>
              <select value={minAttendance} onChange={(e) => setMinAttendance(e.target.value)}>
                <option value="75%">75% Required</option>
                <option value="80%">80% Required</option>
                <option value="85%">85% Required</option>
                <option value="90%">90% Required</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Section 3: SMS & Notifications ───────────────── */}
        <div className="settings-tab-layout bg-glass">
          <div className="settings-header">
            <FaSms className="settings-header-icon" style={{ color: "#10b981" }} />
            <div>
              <h3>SMS Gateway &amp; Automated Notifications</h3>
              <p>Integrate mobile notifications sent directly to parents</p>
            </div>
          </div>
          <div className="settings-form-grid" style={{ gridTemplateColumns: "1.2fr 2fr", gap: "32px" }}>
            <div className="modal-input-group">
              <label>Active SMS Gateway Provider</label>
              <select value={smsGateway} onChange={(e) => setSmsGateway(e.target.value)}>
                <option value="twilio">Twilio Gateway API</option>
                <option value="firebase">Firebase Notification Service</option>
                <option value="nexmo">Vonage (Nexmo) Gateway</option>
                <option value="aws">AWS Simple Notification Service</option>
              </select>
            </div>
            <div className="modal-input-group">
              <label>SMS Text Template (Variable: {"{name}"})</label>
              <textarea
                value={smsTemplate}
                onChange={(e) => setSmsTemplate(e.target.value)}
                className="settings-textarea"
                required
              />
            </div>
          </div>

          <div className="settings-divider" />

          <div className="settings-toggles-list">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
              <span className="checkbox-checkmark" />
              <span className="checkbox-label" style={{ lineHeight: "1.4" }}>
                <FaEnvelope style={{ marginRight: "6px", color: "#3b82f6", verticalAlign: "middle" }} />
                Send daily summary emails to Class Teachers and Coordinators
              </span>
            </label>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
              />
              <span className="checkbox-checkmark" />
              <span className="checkbox-label" style={{ lineHeight: "1.4" }}>
                <FaServer style={{ marginRight: "6px", color: "#10b981", verticalAlign: "middle" }} />
                Send instant SMS alerts to parents of absent students upon attendance entry
              </span>
            </label>
          </div>
        </div>

        {/* ── Submit ────────────────────────────────────────── */}
        <div className="settings-actions" style={{ marginBottom: "40px" }}>
          <button type="submit" className="primary-action-btn">
            <FaSave />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </>
  );
}

export default SettingsTab;
