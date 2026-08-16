import { useState, useEffect } from "react";
import {
  Settings,
  Palette,
  Bell,
  Mail,
  Sliders,
  CloudLightning,
  Shield,
  Globe,
  Cpu,
  Check,
  Lock,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  SlidersHorizontal,
  Key,
  Users,
  Calendar
} from "lucide-react";
import "../../styles/SettingsTab.css";

const SETTINGS_KEY = "sam_admin_settings";

function SettingsTab({ onSettingsChange, triggerBanner }) {
  // --- Active Tab ---
  const [activeTab, setActiveTab] = useState("all");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // --- 1. General Settings State ---
  const [collegeName, setCollegeName] = useState("Siddesh Infotech College");
  const [systemTitle, setSystemTitle] = useState("Student Attendance Management System");
  const [academicYear, setAcademicYear] = useState("2024 - 2025");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("DD MMM YYYY");
  const [collegeLogo, setCollegeLogo] = useState("");

  // --- 2. Appearance State ---
  const [themeMode, setThemeMode] = useState("light");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [sidebarStyle, setSidebarStyle] = useState("default");
  const [layoutStyle, setLayoutStyle] = useState("modern");

  // --- 3. Notification Settings State ---
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [examNotifications, setExamNotifications] = useState(true);
  const [reportNotifications, setReportNotifications] = useState(false);

  // --- 4. Email Configuration State ---
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [adminEmail, setAdminEmail] = useState("admin@siddeshinfotech.edu.in");
  const [smtpPassword, setSmtpPassword] = useState("••••••••••••");
  const [encryption, setEncryption] = useState("TLS");
  const [isSendingTest, setIsSendingTest] = useState(false);

  // --- 5. Backup & Restore State ---
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [backupRetention, setBackupRetention] = useState("30 days");
  const [lastBackup, setLastBackup] = useState("20 May 2026, 02:30 AM");
  const [isBackupLoading, setIsBackupLoading] = useState(false);

  // --- 6. Security Settings State ---
  const [enable2FA, setEnable2FA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState(true);
  const [passwordExpiryDays, setPasswordExpiryDays] = useState("90");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");

  // --- 7. Role & Permission Management State ---
  const [roles, setRoles] = useState(["Admin", "Student"]);
  const [permissionsMatrix, setPermissionsMatrix] = useState({
    Admin: { read: true, write: true, edit: true, delete: true },
    Student: { read: true, write: false, edit: false, delete: false }
  });
  const [newRoleName, setNewRoleName] = useState("");

  // --- 8. Attendance System Settings State ---
  const [minAttendance, setMinAttendance] = useState("75%");
  const [workingDays, setWorkingDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [holidays, setHolidays] = useState([
    { id: 1, name: "Independence Day", date: "2026-08-15" },
    { id: 2, name: "Christmas", date: "2026-12-25" }
  ]);
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [attendanceWindow, setAttendanceWindow] = useState("09:00 AM");
  const [lateGracePeriod, setLateGracePeriod] = useState("15");
  const [autoAttendance, setAutoAttendance] = useState(false);
  const [attendanceLockDate, setAttendanceLockDate] = useState("2026-08-31");

  // Load settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const s = JSON.parse(saved);
        if (s.collegeName) setCollegeName(s.collegeName);
        if (s.systemTitle) setSystemTitle(s.systemTitle);
        if (s.academicYear) setAcademicYear(s.academicYear);
        if (s.language) setLanguage(s.language);
        if (s.timezone) setTimezone(s.timezone);
        if (s.dateFormat) setDateFormat(s.dateFormat);
        if (s.collegeLogo) setCollegeLogo(s.collegeLogo);
        if (s.themeMode) setThemeMode(s.themeMode);
        if (s.primaryColor) setPrimaryColor(s.primaryColor);
        if (s.sidebarStyle) setSidebarStyle(s.sidebarStyle);
        if (s.layoutStyle) setLayoutStyle(s.layoutStyle);
        if (s.enableNotifications !== undefined) setEnableNotifications(s.enableNotifications);
        if (s.emailNotifications !== undefined) setEmailNotifications(s.emailNotifications);
        if (s.attendanceAlerts !== undefined) setAttendanceAlerts(s.attendanceAlerts);
        if (s.examNotifications !== undefined) setExamNotifications(s.examNotifications);
        if (s.reportNotifications !== undefined) setReportNotifications(s.reportNotifications);
        if (s.smtpHost) setSmtpHost(s.smtpHost);
        if (s.smtpPort) setSmtpPort(s.smtpPort);
        if (s.adminEmail) setAdminEmail(s.adminEmail);
        if (s.encryption) setEncryption(s.encryption);
        if (s.autoBackup !== undefined) setAutoBackup(s.autoBackup);
        if (s.backupFrequency) setBackupFrequency(s.backupFrequency);
        if (s.backupRetention) setBackupRetention(s.backupRetention);
        if (s.lastBackup) setLastBackup(s.lastBackup);
        if (s.enable2FA !== undefined) setEnable2FA(s.enable2FA);
        if (s.sessionTimeout !== undefined) setSessionTimeout(s.sessionTimeout);
        if (s.passwordExpiry !== undefined) setPasswordExpiry(s.passwordExpiry);
        if (s.passwordExpiryDays) setPasswordExpiryDays(s.passwordExpiryDays);
        if (s.maxLoginAttempts) setMaxLoginAttempts(s.maxLoginAttempts);
        if (s.permissionsMatrix) setPermissionsMatrix(s.permissionsMatrix);
        if (s.minAttendance) setMinAttendance(s.minAttendance);
        if (s.workingDays) setWorkingDays(s.workingDays);
        if (s.holidays) setHolidays(s.holidays);
        if (s.attendanceWindow) setAttendanceWindow(s.attendanceWindow);
        if (s.lateGracePeriod) setLateGracePeriod(s.lateGracePeriod);
        if (s.autoAttendance !== undefined) setAutoAttendance(s.autoAttendance);
        if (s.attendanceLockDate) setAttendanceLockDate(s.attendanceLockDate);
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  }, []);

  // Apply dark mode theme to body
  useEffect(() => {
    if (themeMode === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [themeMode]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleSaveAll = () => {
    const allSettings = {
      collegeName, systemTitle, academicYear, language, timezone, dateFormat, collegeLogo,
      themeMode, primaryColor, sidebarStyle, layoutStyle,
      enableNotifications, emailNotifications, attendanceAlerts, examNotifications, reportNotifications,
      smtpHost, smtpPort, adminEmail, encryption,
      autoBackup, backupFrequency, backupRetention, lastBackup,
      enable2FA, sessionTimeout, passwordExpiry, passwordExpiryDays, maxLoginAttempts,
      permissionsMatrix, minAttendance, workingDays, holidays,
      attendanceWindow, lateGracePeriod, autoAttendance, attendanceLockDate
    };

    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(allSettings));
      if (onSettingsChange) {
        onSettingsChange({ schoolName: collegeName, academicYear });
      }
      if (triggerBanner) {
        triggerBanner("All settings configurations saved successfully!");
      }
      showToast("Settings Saved Successfully!");
    } catch (e) {
      showToast("Error saving configurations.");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all configurations to defaults?")) {
      setCollegeName("Siddesh Infotech College");
      setSystemTitle("Student Attendance Management System");
      setAcademicYear("2024 - 2025");
      setLanguage("English");
      setTimezone("Asia/Kolkata");
      setDateFormat("DD MMM YYYY");
      setCollegeLogo("");
      setThemeMode("light");
      setPrimaryColor("#3b82f6");
      setSidebarStyle("default");
      setLayoutStyle("modern");
      setEnableNotifications(true);
      setEmailNotifications(true);
      setAttendanceAlerts(true);
      setExamNotifications(true);
      setReportNotifications(false);
      setSmtpHost("smtp.gmail.com");
      setSmtpPort("587");
      setAdminEmail("admin@siddeshinfotech.edu.in");
      setSmtpPassword("••••••••••••");
      setEncryption("TLS");
      setAutoBackup(true);
      setBackupFrequency("daily");
      setBackupRetention("30 days");
      setEnable2FA(false);
      setSessionTimeout(true);
      setPasswordExpiry(true);
      setPasswordExpiryDays("90");
      setMaxLoginAttempts("5");
      setMinAttendance("75%");
      setWorkingDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
      setHolidays([
        { id: 1, name: "Independence Day", date: "2026-08-15" },
        { id: 2, name: "Christmas", date: "2026-12-25" }
      ]);
      setAttendanceWindow("09:00 AM");
      setLateGracePeriod("15");
      setAutoAttendance(false);
      setAttendanceLockDate("2026-08-31");
      setRoles(["Admin", "Student"]);
      setPermissionsMatrix({
        Admin: { read: true, write: true, edit: true, delete: true },
        Student: { read: true, write: false, edit: false, delete: false }
      });
      showToast("Settings Reset to Defaults");
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCollegeLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerTestEmail = () => {
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      showToast(`Test email successfully sent to ${adminEmail}!`);
    }, 1500);
  };

  const triggerCreateBackup = () => {
    setIsBackupLoading(true);
    setTimeout(() => {
      setIsBackupLoading(false);
      const now = new Date();
      setLastBackup(now.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }));
      showToast("Database backup archive created successfully!");
    }, 2000);
  };

  const triggerRestoreBackup = () => {
    const confirm = window.confirm("Restoring from backup will overwrite current database records. Proceed?");
    if (confirm) {
      showToast("System restore initialized... Databases synchronized!");
    }
  };

  const togglePermission = (role, action) => {
    setPermissionsMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [action]: !prev[role][action]
      }
    }));
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    if (roles.includes(newRoleName.trim())) {
      showToast("Role already exists.");
      return;
    }
    const cleanRole = newRoleName.trim();
    setRoles([...roles, cleanRole]);
    setPermissionsMatrix((prev) => ({
      ...prev,
      [cleanRole]: { read: true, write: false, edit: false, delete: false }
    }));
    setNewRoleName("");
    showToast(`Role '${cleanRole}' added successfully!`);
  };

  const handleDeleteRole = (roleToDelete) => {
    if (roleToDelete === "Admin") {
      showToast("Cannot delete primary Admin role.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete the role '${roleToDelete}'?`)) {
      setRoles(roles.filter((r) => r !== roleToDelete));
      const updatedMatrix = { ...permissionsMatrix };
      delete updatedMatrix[roleToDelete];
      setPermissionsMatrix(updatedMatrix);
      showToast(`Role '${roleToDelete}' removed.`);
    }
  };

  const handleAddHoliday = (e) => {
    e.preventDefault();
    if (!newHolidayName.trim() || !newHolidayDate) return;
    const newHoliday = {
      id: Date.now(),
      name: newHolidayName.trim(),
      date: newHolidayDate
    };
    setHolidays([...holidays, newHoliday]);
    setNewHolidayName("");
    setNewHolidayDate("");
    showToast(`Holiday '${newHoliday.name}' added successfully!`);
  };

  const handleDeleteHoliday = (id) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };

  const handleWorkingDayToggle = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const shouldShow = (section) => activeTab === "all" || activeTab === section;

  return (
    <>
      {/* Settings Top Bar */}
      <div className="settings-header-bar">
        <div className="settings-title-section">
          <h2>Settings</h2>
          <div className="settings-breadcrumb">Dashboard &gt; Settings</div>
        </div>
        <div className="settings-header-actions">
          <button type="button" onClick={handleReset} className="btn-reset">
            Reset Defaults
          </button>
          <button type="button" onClick={handleSaveAll} className="btn-save-all">
            <Save size={16} />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Main Settings Content */}
      <div className="settings-container">
        <main className="settings-main-content">
          <div className="settings-grid-layout">
            
            {/* 1. GENERAL SETTINGS */}
            {shouldShow("general") && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="settings-card-icon-wrapper">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h3>General Settings</h3>
                    <p>Manage basic system configuration profile</p>
                  </div>
                </div>

                <div className="logo-upload-wrapper">
                  <div className="logo-preview">
                    {collegeLogo ? (
                      <img src={collegeLogo} alt="College Logo Preview" />
                    ) : (
                      <Globe size={24} />
                    )}
                  </div>
                  <div className="upload-actions">
                    <label className="btn-upload-label">
                      Upload College Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                    {collegeLogo && (
                      <button
                        type="button"
                        onClick={() => setCollegeLogo("")}
                        className="btn-delete-icon"
                        style={{ alignSelf: "flex-start", marginTop: "4px" }}
                      >
                        Remove logo
                      </button>
                    )}
                    <span className="upload-hint">PNG, JPG up to 1MB</span>
                  </div>
                </div>

                <div className="settings-input-group">
                  <label>School/College Name</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="settings-input"
                  />
                </div>

                <div className="settings-input-group">
                  <label>System Title</label>
                  <input
                    type="text"
                    value={systemTitle}
                    onChange={(e) => setSystemTitle(e.target.value)}
                    className="settings-input"
                  />
                </div>

                <div className="settings-form-row">
                  <div className="settings-input-group">
                    <label>Academic Year</label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="settings-select"
                    >
                      <option value="2024 - 2025">2024 - 2025</option>
                      <option value="2025 - 2026">2025 - 2026</option>
                      <option value="2026 - 2027">2026 - 2027</option>
                    </select>
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-input-group">
                    <label>Default Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="settings-select"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>
                  <div className="settings-input-group">
                    <label>Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="settings-select"
                    >
                      <option value="Asia/Kolkata">(UTC+05:30) Asia/Kolkata</option>
                      <option value="UTC">(UTC+00:00) London</option>
                      <option value="America/New_York">(UTC-05:00) Eastern Time</option>
                    </select>
                  </div>
                </div>

                <div className="settings-input-group">
                  <label>Date Format</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="settings-select"
                  >
                    <option value="DD MMM YYYY">DD MMM YYYY (e.g. 08 Aug 2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-08-08)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 08/08/2026)</option>
                  </select>
                </div>
              </div>
            )}

            {/* 2. APPEARANCE SETTINGS */}
            {shouldShow("appearance") && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="settings-card-icon-wrapper" style={{ color: "#a855f7", background: "rgba(168, 85, 247, 0.1)" }}>
                    <Palette size={20} />
                  </div>
                  <div>
                    <h3>Appearance Settings</h3>
                    <p>Customize portal theme and styles</p>
                  </div>
                </div>

                <div className="settings-input-group">
                  <label>Theme Mode</label>
                  <div className="mode-toggle-group">
                    <button
                      type="button"
                      onClick={() => setThemeMode("light")}
                      className={`mode-btn ${themeMode === "light" ? "active" : ""}`}
                    >
                      Light Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeMode("dark")}
                      className={`mode-btn ${themeMode === "dark" ? "active" : ""}`}
                    >
                      Dark Mode
                    </button>
                  </div>
                </div>

                <div className="settings-input-group">
                  <label>Primary Theme Color</label>
                  <div className="color-circles">
                    {["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#06b6d4", "#1e293b"].map((color) => (
                      <div
                        key={color}
                        onClick={() => setPrimaryColor(color)}
                        className={`color-circle ${primaryColor === color ? "active" : ""}`}
                        style={{ backgroundColor: color }}
                      >
                        {primaryColor === color && <Check size={14} />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="settings-input-group">
                  <label>Sidebar Style</label>
                  <div className="mode-toggle-group">
                    <button
                      type="button"
                      onClick={() => setSidebarStyle("default")}
                      className={`mode-btn ${sidebarStyle === "default" ? "active" : ""}`}
                    >
                      Default
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidebarStyle("compact")}
                      className={`mode-btn ${sidebarStyle === "compact" ? "active" : ""}`}
                    >
                      Compact
                    </button>
                  </div>
                </div>

                <div className="settings-input-group">
                  <label>Layout Style</label>
                  <div className="mode-toggle-group">
                    <button
                      type="button"
                      onClick={() => setLayoutStyle("modern")}
                      className={`mode-btn ${layoutStyle === "modern" ? "active" : ""}`}
                    >
                      Modern
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutStyle("classic")}
                      className={`mode-btn ${layoutStyle === "classic" ? "active" : ""}`}
                    >
                      Classic
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. NOTIFICATION SETTINGS */}
            {shouldShow("notifications") && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="settings-card-icon-wrapper" style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3>Notification Settings</h3>
                    <p>Configure automated system triggers</p>
                  </div>
                </div>

                <div className="settings-toggle-list">
                  <div className="settings-toggle-row">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-title">Enable Notifications</span>
                      <span className="settings-toggle-desc">Turn on all system push banners</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={enableNotifications}
                        onChange={(e) => setEnableNotifications(e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  </div>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-title">Email Notifications</span>
                      <span className="settings-toggle-desc">Send reports directly via email</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        disabled={!enableNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  </div>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-title">Attendance Alerts</span>
                      <span className="settings-toggle-desc">Low attendance trigger warnings</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={attendanceAlerts}
                        disabled={!enableNotifications}
                        onChange={(e) => setAttendanceAlerts(e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  </div>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-title">Exam Notifications</span>
                      <span className="settings-toggle-desc">Schedules and announcement updates</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={examNotifications}
                        disabled={!enableNotifications}
                        onChange={(e) => setExamNotifications(e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  </div>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-title">Report Notifications</span>
                      <span className="settings-toggle-desc">Monthly status summaries</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={reportNotifications}
                        disabled={!enableNotifications}
                        onChange={(e) => setReportNotifications(e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 4. EMAIL CONFIGURATION */}
            {shouldShow("email") && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="settings-card-icon-wrapper" style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)" }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3>Email Settings</h3>
                    <p>Configure custom SMTP mailing profiles</p>
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-input-group">
                    <label>SMTP Host</label>
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="smtp.example.com"
                      className="settings-input"
                    />
                  </div>
                  <div className="settings-input-group" style={{ maxWidth: "120px" }}>
                    <label>SMTP Port</label>
                    <input
                      type="text"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="587"
                      className="settings-input"
                    />
                  </div>
                </div>

                <div className="settings-input-group">
                  <label>Admin Email Address</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@school.com"
                    className="settings-input"
                  />
                </div>

                <div className="settings-input-group">
                  <label>SMTP Password</label>
                  <input
                    type="password"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    className="settings-input"
                  />
                </div>

                <div className="settings-input-group">
                  <label>Encryption Protocol</label>
                  <select
                    value={encryption}
                    onChange={(e) => setEncryption(e.target.value)}
                    className="settings-select"
                  >
                    <option value="TLS">TLS (Recommended)</option>
                    <option value="SSL">SSL</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={triggerTestEmail}
                  disabled={isSendingTest}
                  className="btn-action-outline"
                >
                  <Mail size={16} />
                  {isSendingTest ? "Sending test mail..." : "Send Test Email"}
                </button>
              </div>
            )}

            {/* 5. BACKUP & RESTORE */}
            {shouldShow("backup") && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="settings-card-icon-wrapper" style={{ color: "#3b82f6", background: "rgba(59, 130, 246, 0.1)" }}>
                    <CloudLightning size={20} />
                  </div>
                  <div>
                    <h3>Backup &amp; Restore</h3>
                    <p>Manage system database archives</p>
                  </div>
                </div>

                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>Last Backup</span>
                    <span className="backup-status-badge">Success</span>
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1e293b", marginTop: "8px" }}>
                    {lastBackup}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                    (Auto Backup Enabled)
                  </div>
                </div>

                <div className="settings-form-row">
                  <button
                    type="button"
                    onClick={triggerCreateBackup}
                    disabled={isBackupLoading}
                    className="btn-action-primary"
                  >
                    <CloudLightning size={16} />
                    {isBackupLoading ? "Creating backup..." : "Create Backup Now"}
                  </button>
                  <button
                    type="button"
                    onClick={triggerRestoreBackup}
                    className="btn-action-outline"
                  >
                    <RefreshCw size={16} />
                    Restore Backup
                  </button>
                </div>

                <div className="settings-divider" />

                <div className="settings-toggle-row">
                  <div className="settings-toggle-label">
                    <span className="settings-toggle-title">Auto Backup</span>
                    <span className="settings-toggle-desc">Enable automated database archiving</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={autoBackup}
                      onChange={(e) => setAutoBackup(e.target.checked)}
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-form-row">
                  <div className="settings-input-group">
                    <label>Backup Frequency</label>
                    <select
                      value={backupFrequency}
                      disabled={!autoBackup}
                      onChange={(e) => setBackupFrequency(e.target.value)}
                      className="settings-select"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="settings-input-group">
                    <label>Backup Retention</label>
                    <select
                      value={backupRetention}
                      disabled={!autoBackup}
                      onChange={(e) => setBackupRetention(e.target.value)}
                      className="settings-select"
                    >
                      <option value="7 days">7 Days</option>
                      <option value="30 days">30 Days</option>
                      <option value="90 days">90 Days</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SECURITY SETTINGS */}
            {shouldShow("security") && (
              <div className="settings-card">
                <div className="settings-card-header">
                  <div className="settings-card-icon-wrapper" style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.1)" }}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3>Security Settings</h3>
                    <p>Manage security protocols</p>
                  </div>
                </div>

                <div className="settings-toggle-list">
                  <div className="settings-toggle-row">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-title">Two Factor Authentication (2FA)</span>
                      <span className="settings-toggle-desc">Add extra security to Admin/Teacher accounts</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={enable2FA}
                        onChange={(e) => setEnable2FA(e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  </div>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-title">Login Session Timeout</span>
                      <span className="settings-toggle-desc">Automatically logout inactive sessions</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  </div>

                  <div className="settings-toggle-row">
                    <div className="settings-toggle-label">
                      <span className="settings-toggle-title">Password Expiry</span>
                      <span className="settings-toggle-desc">Force pass change periodically</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={passwordExpiry}
                        onChange={(e) => setPasswordExpiry(e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-input-group">
                    <label>Password Expiry Days</label>
                    <input
                      type="number"
                      disabled={!passwordExpiry}
                      value={passwordExpiryDays}
                      onChange={(e) => setPasswordExpiryDays(e.target.value)}
                      className="settings-input"
                    />
                  </div>
                  <div className="settings-input-group">
                    <label>Maximum Login Attempts</label>
                    <input
                      type="number"
                      value={maxLoginAttempts}
                      onChange={(e) => setMaxLoginAttempts(e.target.value)}
                      className="settings-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7. ROLE & PERMISSION MANAGEMENT */}
            {shouldShow("roles") && (
              <div className="settings-card" style={{ gridColumn: activeTab === "all" ? "1 / -1" : "auto" }}>
                <div className="settings-card-header">
                  <div className="settings-card-icon-wrapper" style={{ color: "#6366f1", background: "rgba(99, 102, 241, 0.1)" }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <h3>Role &amp; Permission Management</h3>
                    <p>Configure system authorizations and access matrix</p>
                  </div>
                </div>

                <form onSubmit={handleCreateRole} className="holiday-add-form" style={{ marginBottom: "8px" }}>
                  <input
                    type="text"
                    placeholder="Enter new role name... (e.g. Coordinator)"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="settings-input"
                  />
                  <button type="submit" className="btn-action-primary" style={{ width: "auto", whiteSpace: "nowrap" }}>
                    <Plus size={16} />
                    <span>Create Role</span>
                  </button>
                </form>

                <div className="matrix-container">
                  <table className="matrix-table">
                    <thead>
                      <tr>
                        <th>Role Name</th>
                        <th style={{ textAlign: "center" }}>Read</th>
                        <th style={{ textAlign: "center" }}>Write</th>
                        <th style={{ textAlign: "center" }}>Edit</th>
                        <th style={{ textAlign: "center" }}>Delete</th>
                        <th style={{ textAlign: "center" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((role) => (
                        <tr key={role}>
                          <td style={{ fontWeight: "600", color: "#334155" }}>{role}</td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={permissionsMatrix[role]?.read || false}
                              onChange={() => togglePermission(role, "read")}
                              className="matrix-checkbox"
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={permissionsMatrix[role]?.write || false}
                              onChange={() => togglePermission(role, "write")}
                              className="matrix-checkbox"
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={permissionsMatrix[role]?.edit || false}
                              onChange={() => togglePermission(role, "edit")}
                              className="matrix-checkbox"
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={permissionsMatrix[role]?.delete || false}
                              onChange={() => togglePermission(role, "delete")}
                              className="matrix-checkbox"
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(role)}
                              className="btn-delete-icon"
                              style={{ margin: "0 auto" }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. ATTENDANCE SYSTEM SETTINGS */}
            {shouldShow("attendance") && (
              <div className="settings-card" style={{ gridColumn: activeTab === "all" ? "1 / -1" : "auto" }}>
                <div className="settings-card-header">
                  <div className="settings-card-icon-wrapper" style={{ color: "#06b6d4", background: "rgba(6, 182, 212, 0.1)" }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3>Attendance System Settings</h3>
                    <p>Configure attendance requirements, late entry thresholds and calendar rules</p>
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-input-group">
                    <label>Minimum Attendance Percentage</label>
                    <select
                      value={minAttendance}
                      onChange={(e) => setMinAttendance(e.target.value)}
                      className="settings-select"
                    >
                      <option value="75%">75% Required</option>
                      <option value="80%">80% Required</option>
                      <option value="85%">85% Required</option>
                      <option value="90%">90% Required</option>
                    </select>
                  </div>

                  <div className="settings-input-group">
                    <label>Attendance Lock Date</label>
                    <input
                      type="date"
                      value={attendanceLockDate}
                      onChange={(e) => setAttendanceLockDate(e.target.value)}
                      className="settings-input"
                    />
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-input-group">
                    <label>Attendance Time Window (Late Threshold)</label>
                    <select
                      value={attendanceWindow}
                      onChange={(e) => setAttendanceWindow(e.target.value)}
                      className="settings-select"
                    >
                      <option value="08:45 AM">08:45 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="09:15 AM">09:15 AM</option>
                      <option value="09:30 AM">09:30 AM</option>
                    </select>
                  </div>

                  <div className="settings-input-group">
                    <label>Late Grace Period Limit (Minutes)</label>
                    <input
                      type="number"
                      value={lateGracePeriod}
                      onChange={(e) => setLateGracePeriod(e.target.value)}
                      className="settings-input"
                    />
                  </div>
                </div>

                <div className="settings-input-group">
                  <label>Working Days</label>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                      const isChecked = workingDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleWorkingDayToggle(day)}
                          className={`mode-btn ${isChecked ? "active" : ""}`}
                          style={{ padding: "8px 16px", minWidth: "60px" }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="settings-toggle-row">
                  <div className="settings-toggle-label">
                    <span className="settings-toggle-title">Auto Attendance Settings</span>
                    <span className="settings-toggle-desc">Automatically mark unsubmitted registers as present</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={autoAttendance}
                      onChange={(e) => setAutoAttendance(e.target.checked)}
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="settings-divider" />

                <div className="settings-input-group">
                  <label style={{ fontWeight: "600" }}>Holidays Management</label>
                  
                  <form onSubmit={handleAddHoliday} className="holiday-add-form">
                    <input
                      type="text"
                      placeholder="Holiday Name (e.g. Diwali)"
                      value={newHolidayName}
                      onChange={(e) => setNewHolidayName(e.target.value)}
                      className="settings-input"
                      style={{ flex: 2 }}
                    />
                    <input
                      type="date"
                      value={newHolidayDate}
                      onChange={(e) => setNewHolidayDate(e.target.value)}
                      className="settings-input"
                      style={{ flex: 1.5 }}
                    />
                    <button type="submit" className="btn-action-primary" style={{ width: "auto" }}>
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </form>

                  <div className="holiday-list">
                    {holidays.map((h) => (
                      <div key={h.id} className="holiday-item">
                        <div>
                          <strong style={{ color: "#334155" }}>{h.name}</strong>
                          <span style={{ marginLeft: "12px", color: "#64748b", fontSize: "0.8rem" }}>{h.date}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteHoliday(h.id)}
                          className="btn-delete-icon"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Success Toast Notification */}
      {toastMessage && (
        <div className="settings-toast">
          <Check size={18} style={{ color: "#10b981" }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export default SettingsTab;
