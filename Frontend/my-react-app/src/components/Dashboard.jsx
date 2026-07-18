import { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaClock,
  FaSearch,
  FaFilter,
  FaSignOutAlt,
  FaPlus,
  FaCalendarAlt,
  FaChevronRight,
  FaGraduationCap,
  FaChartLine,
  FaCog,
  FaFileAlt,
  FaEdit,
  FaCheck,
  FaTimes,
  FaUserPlus,
  FaFilePdf,
  FaCloudDownloadAlt,
  FaSave,
  FaUniversity,
  FaExclamationTriangle,
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaSms,
  FaServer,
  FaChevronLeft,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { jsPDF } from "jspdf";
import "../styles/Dashboard.css";

function Dashboard({ setPage }) {
  // Navigation Active Tab System
  const [activeTab, setActiveTab] = useState("dashboard");

  // Initial Student Data
  const [students, setStudents] = useState([
    { id: 1, name: "Aarav Sharma", rollNo: "101", grade: "Grade 10", status: "Present", time: "08:45 AM" },
    { id: 2, name: "Diya Patel", rollNo: "102", grade: "Grade 10", status: "Present", time: "08:50 AM" },
    { id: 3, name: "Kabir Mehta", rollNo: "103", grade: "Grade 11", status: "Absent", time: "-" },
    { id: 4, name: "Isha Iyer", rollNo: "104", grade: "Grade 12", status: "Late", time: "09:05 AM" },
    { id: 5, name: "Rohan Das", rollNo: "105", grade: "Grade 9", status: "Present", time: "08:42 AM" },
    { id: 6, name: "Ananya Sen", rollNo: "106", grade: "Grade 11", status: "Absent", time: "-" },
    { id: 7, name: "Dev Shah", rollNo: "107", grade: "Grade 12", status: "Present", time: "08:55 AM" },
    { id: 8, name: "Meera Nair", rollNo: "108", grade: "Grade 9", status: "Present", time: "08:35 AM" },
    { id: 9, name: "Vivaan Kapoor", rollNo: "109", grade: "Grade 11", status: "Late", time: "09:12 AM" },
    { id: 10, name: "Aditi Rao", rollNo: "110", grade: "Grade 10", status: "Present", time: "08:48 AM" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // Forms & Banners
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentRoll, setNewStudentRoll] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("Grade 10");
  const [newStudentStatus, setNewStudentStatus] = useState("Present");
  const [successBanner, setSuccessBanner] = useState("");

  // Settings values
  const [schoolName, setSchoolName] = useState("Siddesh Infotech High School");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [lateThreshold, setLateThreshold] = useState("09:00 AM");
  const [gracePeriod, setGracePeriod] = useState("15 Minutes");
  const [minAttendance, setMinAttendance] = useState("75%");
  const [smsGateway, setSmsGateway] = useState("twilio");
  const [smsTemplate, setSmsTemplate] = useState("Dear Parent, your child {name} has been marked ABSENT in today's logger list. - ScholarTrack Admin");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  // Custom Calendar State variables
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-18");
  const [showDatePicker, setShowDatePicker] = useState(null); // 'start', 'end', or null
  const [calMonth, setCalMonth] = useState(6); // July (0-indexed)
  const [calYear, setCalYear] = useState(2026);

  // Month names helper
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Download simulation
  const [downloadingId, setDownloadingId] = useState(null);

  // Dynamic KPI Stats calculated from student list
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    rate: 0,
    onTime: 0
  });

  // Calculate live stats based on student list changes
  useEffect(() => {
    const total = students.length;
    const present = students.filter(s => s.status === "Present" || s.status === "Late").length;
    const absent = students.filter(s => s.status === "Absent").length;
    const late = students.filter(s => s.status === "Late").length;

    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    const onTime = present > 0 ? (((present - late) / present) * 100).toFixed(1) : 0;

    setStats({ total, present, absent, rate, onTime });
  }, [students]);

  // Update Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show auto-dismiss notifications/success banners
  const triggerSuccessBanner = (message) => {
    setSuccessBanner(message);
    setTimeout(() => {
      setSuccessBanner("");
    }, 4500);
  };

  // Filtered Students List
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Dynamic Status Change inside table (Present -> Absent -> Late cycle)
  const cycleStatus = (id) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        let nextStatus = "Present";
        let nextTime = "08:45 AM";
        if (student.status === "Present") {
          nextStatus = "Absent";
          nextTime = "-";
        } else if (student.status === "Absent") {
          nextStatus = "Late";
          nextTime = "09:05 AM";
        }
        return { ...student, status: nextStatus, time: nextTime };
      }
      return student;
    }));
  };

  // Add new student
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName || !newStudentRoll) return;

    const timeString = newStudentStatus === "Absent" ? "-" : (newStudentStatus === "Late" ? "09:10 AM" : "08:40 AM");
    const newlyCreated = {
      id: students.length + 1,
      name: newStudentName,
      rollNo: newStudentRoll,
      grade: newStudentGrade,
      status: newStudentStatus,
      time: timeString
    };

    setStudents(prev => [newlyCreated, ...prev]);
    setNewStudentName("");
    setNewStudentRoll("");
    triggerSuccessBanner(`Student "${newStudentName}" successfully enrolled and added to logs!`);
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    triggerSuccessBanner("System configurations and gateway credentials updated successfully!");
  };

  // Generate and Download real PDF using jsPDF
  const handleDownloadReport = (reportName, id) => {
    setDownloadingId(id);

    setTimeout(() => {
      try {
        const doc = new jsPDF();

        // Title banner card background
        doc.setFillColor(9, 13, 31);
        doc.rect(0, 0, 210, 40, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("SCHOLARTRACK - ATTENDANCE SYSTEM", 15, 18);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Official Academic Report Ledger | ${schoolName}`, 15, 30);

        // Report Details Section
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(reportName, 15, 55);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated Date: ${currentDate} ${currentTime}`, 15, 63);
        doc.text(`Academic Session: ${academicYear}`, 15, 69);
        doc.text(`Late Threshold Limit: ${lateThreshold} | Grace Period: ${gracePeriod}`, 15, 75);

        // Draw line separator
        doc.setDrawColor(226, 232, 240);
        doc.line(15, 80, 195, 80);

        // Table Headers Background
        doc.setFillColor(248, 250, 252);
        doc.rect(15, 85, 180, 8, "F");
        doc.rect(15, 85, 180, 8);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Student Name", 18, 90);
        doc.text("Roll No", 80, 90);
        doc.text("Grade", 115, 90);
        doc.text("Status", 150, 90);
        doc.text("Arrival Time", 175, 90);

        // Table Rows
        doc.setFont("helvetica", "normal");
        let startY = 93;
        students.forEach((student, index) => {
          doc.line(15, startY + 8, 195, startY + 8);

          doc.text(student.name, 18, startY + 5);
          doc.text(student.rollNo, 80, startY + 5);
          doc.text(student.grade, 115, startY + 5);

          // Color code status text
          if (student.status === "Present") {
            doc.setTextColor(16, 185, 129); // Green
          } else if (student.status === "Absent") {
            doc.setTextColor(239, 68, 68); // Red
          } else {
            doc.setTextColor(249, 115, 22); // Orange
          }
          doc.text(student.status, 150, startY + 5);
          doc.setTextColor(15, 23, 42); // Reset to Dark slate

          doc.text(student.time, 175, startY + 5);
          startY += 8;
        });

        // Summary Footer
        startY += 10;
        doc.setFillColor(239, 246, 255);
        doc.rect(15, startY, 180, 22, "F");
        doc.rect(15, startY, 180, 22);

        doc.setFont("helvetica", "bold");
        doc.text(`Total Students: ${stats.total}`, 20, startY + 8);
        doc.text(`Attendance Rate: ${stats.rate}%`, 80, startY + 8);
        doc.text(`On-Time Rate: ${stats.onTime}%`, 140, startY + 8);
        doc.text(`Absentees: ${stats.absent}`, 20, startY + 16);

        // Save PDF file
        doc.save(`${reportName.toLowerCase().replace(/\s+/g, "_")}.pdf`);

        setDownloadingId(null);
        triggerSuccessBanner(`${reportName} PDF successfully generated and downloaded!`);
      } catch (err) {
        console.error("PDF download error: ", err);
        setDownloadingId(null);
        triggerSuccessBanner("Failed to generate PDF report.");
      }
    }, 1200);
  };

  // Format date str (YYYY-MM-DD) into standard readable format
  const formatDateDisplay = (dateStr) => {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return `${MONTHS[monthIndex]} ${day}, ${year}`;
  };

  // Custom Calendar Selector Navigation
  const changeMonth = (direction) => {
    if (direction === "prev") {
      if (calMonth === 0) {
        setCalMonth(11);
        setCalYear(prev => prev - 1);
      } else {
        setCalMonth(prev => prev - 1);
      }
    } else {
      if (calMonth === 11) {
        setCalMonth(0);
        setCalYear(prev => prev + 1);
      } else {
        setCalMonth(prev => prev + 1);
      }
    }
  };

  // Custom Calendar Render Layout Grid
  const renderCustomCalendar = (type) => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const startDayIndex = new Date(calYear, calMonth, 1).getDay();
    const startOffset = startDayIndex === 0 ? 6 : startDayIndex - 1; // 0 starts Monday

    // Generate grid items
    const gridItems = [];
    // Offset boxes
    for (let i = 0; i < startOffset; i++) {
      gridItems.push(<div key={`offset-${i}`} className="cal-day-empty"></div>);
    }
    // Days boxes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const monthStr = (calMonth + 1) < 10 ? `0${calMonth + 1}` : `${calMonth + 1}`;
      const fullDateStr = `${calYear}-${monthStr}-${dayStr}`;

      const isSelected = type === "start" ? startDate === fullDateStr : endDate === fullDateStr;

      gridItems.push(
        <button
          key={`day-${day}`}
          type="button"
          className={`cal-day-btn ${isSelected ? "cal-selected" : ""}`}
          onClick={() => {
            if (type === "start") {
              setStartDate(fullDateStr);
            } else {
              setEndDate(fullDateStr);
            }
            setShowDatePicker(null);
          }}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="custom-calendar-popup bg-glass">
        {/* Calendar Nav Header */}
        <div className="cal-nav-header">
          <button type="button" className="cal-nav-btn" onClick={() => changeMonth("prev")}>
            <FaChevronLeft />
          </button>
          <span className="cal-nav-label">
            {MONTHS[calMonth]} {calYear}
          </span>
          <button type="button" className="cal-nav-btn" onClick={() => changeMonth("next")}>
            <FaChevronRight />
          </button>
        </div>

        {/* Days of week labels */}
        <div className="cal-weekdays-row">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
            <div key={d} className="cal-weekday-label">{d}</div>
          ))}
        </div>

        {/* Grid Box */}
        <div className="cal-days-grid">
          {gridItems}
        </div>
      </div>
    );
  };

  // Recharts Data computed dynamically
  const getWeeklyData = () => {
    const currentRate = parseFloat(stats.rate);
    return [
      { day: "Mon", rate: Math.max(70, currentRate - 6) },
      { day: "Tue", rate: Math.max(70, currentRate - 2) },
      { day: "Wed", rate: Math.max(70, currentRate + 3) },
      { day: "Thu", rate: Math.max(70, currentRate - 1) },
      { day: "Fri", rate: currentRate },
      { day: "Sat", rate: Math.max(70, currentRate - 4) } // Saturday!
    ];
  };

  const getClassData = () => {
    const grades = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
    return grades.map(g => {
      const classStudents = students.filter(s => s.grade === g);
      const present = classStudents.filter(s => s.status === "Present" || s.status === "Late").length;
      const absent = classStudents.filter(s => s.status === "Absent").length;
      return { className: g, Present: present, Absent: absent };
    });
  };

  return (
    <div className="dashboard-container">
      {/* Dynamic Success Notification Banner */}
      {successBanner && (
        <div className="success-floating-banner">
          <FaCheck className="banner-icon" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="currentColor" />
              <path d="M9 14l2 2 4-4" />
            </svg>
          </div>
          <div className="sidebar-brand-text">
            <h3>ScholarTrack</h3>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <a
            href="#"
            className={`menu-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={(e) => { e.preventDefault(); setActiveTab("dashboard"); }}
          >
            <FaChartLine className="menu-icon" />
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className={`menu-item ${activeTab === "students" ? "active" : ""}`}
            onClick={(e) => { e.preventDefault(); setActiveTab("students"); }}
          >
            <FaGraduationCap className="menu-icon" />
            <span>Students</span>
          </a>
          <a
            href="#"
            className={`menu-item ${activeTab === "reports" ? "active" : ""}`}
            onClick={(e) => { e.preventDefault(); setActiveTab("reports"); }}
          >
            <FaFileAlt className="menu-icon" />
            <span>Reports</span>
          </a>
          <a
            href="#"
            className={`menu-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={(e) => { e.preventDefault(); setActiveTab("settings"); }}
          >
            <FaCog className="menu-icon" />
            <span>Settings</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => setPage("login")}>
            <FaSignOutAlt />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">

        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <>
            {/* Top Header */}
            <header className="content-header">
              <div className="header-welcome">
                <h2>Dashboard Overview</h2>
                <p className="header-date">
                  <FaCalendarAlt className="date-icon" />
                  <span>{currentDate}</span>
                  <span className="live-clock">{currentTime}</span>
                </p>
              </div>

              <div className="header-actions">
                <button className="primary-action-btn" onClick={() => setActiveTab("students")}>
                  <FaUserPlus />
                  <span>Add Student</span>
                </button>
              </div>
            </header>

            {/* KPI Metric cards */}
            <section className="metrics-grid">
              <div className="metric-card bg-glass">
                <div className="metric-icon-wrap bg-blue">
                  <FaUsers className="metric-icon" />
                </div>
                <div className="metric-info">
                  <h3>{stats.total}</h3>
                  <p>Total Students</p>
                  <span className="metric-trend text-green">+4% this week</span>
                </div>
              </div>

              <div className="metric-card bg-glass">
                <div className="metric-icon-wrap bg-emerald">
                  <FaUserCheck className="metric-icon" />
                </div>
                <div className="metric-info">
                  <h3>{stats.rate}%</h3>
                  <p>Attendance Rate</p>
                  <span className="metric-trend text-green">Good Standing</span>
                </div>
              </div>

              <div className="metric-card bg-glass">
                <div className="metric-icon-wrap bg-red">
                  <FaUserTimes className="metric-icon" />
                </div>
                <div className="metric-info">
                  <h3>{stats.absent}</h3>
                  <p>Today Absentees</p>
                  <span className="metric-trend text-red">Needs review</span>
                </div>
              </div>

              <div className="metric-card bg-glass">
                <div className="metric-icon-wrap bg-orange">
                  <FaClock className="metric-icon" />
                </div>
                <div className="metric-info">
                  <h3>{stats.onTime}%</h3>
                  <p>On-Time Arrival</p>
                  <span className="metric-trend text-green">Above average</span>
                </div>
              </div>
            </section>

            {/* Charts Section */}
            <section className="charts-grid">
              {/* Area Chart - Weekly Attendance Trend */}
              <div className="chart-card bg-glass">
                <div className="chart-card-header">
                  <h3>Weekly Attendance Trend</h3>
                  <span>Percentage (%)</span>
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={getWeeklyData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={14} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={14} tickLine={false} domain={[60, 100]} />
                      <Tooltip
                        contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}
                        labelStyle={{ fontWeight: 600, color: "#1e293b" }}
                      />
                      <Area type="monotone" dataKey="rate" name="Attendance Rate" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart - Class Breakdown */}
              <div className="chart-card bg-glass">
                <div className="chart-card-header">
                  <h3>Attendance by Class</h3>
                  <span>Students Count</span>
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getClassData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="className" stroke="#94a3b8" fontSize={14} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={14} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "14px", marginTop: "10px" }} />
                      <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Database List / Table Section */}
            <section className="table-card bg-glass">
              <div className="table-card-header">
                <div className="table-title">
                  <h3>Live Attendance Logger</h3>
                  <p>Click status labels in the table to dynamically cycle status (Present → Absent → Late)</p>
                </div>

                <div className="table-filters">
                  {/* Search Bar */}
                  <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search student or roll no..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Status Filters */}
                  <div className="filter-badge-row">
                    {["All", "Present", "Absent", "Late"].map(filter => (
                      <button
                        key={filter}
                        className={`filter-badge-btn ${statusFilter === filter ? "active" : ""}`}
                        onClick={() => setStatusFilter(filter)}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Roll No</th>
                      <th>Grade</th>
                      <th>Arrival Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <tr key={student.id}>
                          <td>
                            <div className="student-profile">
                              <div className="avatar-badge">
                                {student.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className="student-name">{student.name}</span>
                            </div>
                          </td>
                          <td>{student.rollNo}</td>
                          <td>{student.grade}</td>
                          <td>
                            <span className="arrival-time">{student.time}</span>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${student.status.toLowerCase()}`}
                              onClick={() => cycleStatus(student.id)}
                              title="Click to toggle status"
                            >
                              {student.status}
                            </span>
                          </td>
                          <td>
                            <button className="table-action-btn" onClick={() => cycleStatus(student.id)}>
                              <FaEdit />
                              <span>Toggle</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="table-empty-state">
                          No student attendance entries match your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: STUDENTS MANAGEMENT (With INLINE "Add Student" Form!) */}
        {activeTab === "students" && (
          <>
            <header className="content-header">
              <div className="header-welcome">
                <h2>Student Roster</h2>
                <p className="header-date">Manage student records and mark logs inline below</p>
              </div>
            </header>

            {/* Students Sub-KPI Cards */}
            <section className="metrics-grid" style={{ marginBottom: "8px" }}>
              <div className="metric-card bg-glass" style={{ padding: "20px 24px" }}>
                <div className="metric-icon-wrap bg-blue" style={{ width: "52px", height: "52px" }}>
                  <FaGraduationCap className="metric-icon" style={{ fontSize: "22px" }} />
                </div>
                <div className="metric-info">
                  <h3 style={{ fontSize: "28px" }}>{students.length}</h3>
                  <p style={{ fontSize: "14px" }}>Total Enrolled</p>
                </div>
              </div>

              <div className="metric-card bg-glass" style={{ padding: "20px 24px" }}>
                <div className="metric-icon-wrap bg-emerald" style={{ width: "52px", height: "52px" }}>
                  <FaUniversity className="metric-icon" style={{ fontSize: "22px" }} />
                </div>
                <div className="metric-info">
                  <h3 style={{ fontSize: "28px" }}>4</h3>
                  <p style={{ fontSize: "14px" }}>Active Classes</p>
                </div>
              </div>

              <div className="metric-card bg-glass" style={{ padding: "20px 24px" }}>
                <div className="metric-icon-wrap bg-orange" style={{ width: "52px", height: "52px" }}>
                  <FaUserPlus className="metric-icon" style={{ fontSize: "22px" }} />
                </div>
                <div className="metric-info">
                  <h3 style={{ fontSize: "28px" }}>+2</h3>
                  <p style={{ fontSize: "14px" }}>New This Month</p>
                </div>
              </div>
            </section>

            <div className="students-tab-grid">
              {/* Left Column: Student List */}
              <div className="table-card bg-glass">
                <div className="table-card-header">
                  <div className="table-title">
                    <h3>Registered Students</h3>
                    <p>Search, view records, or toggle statuses instantly</p>
                  </div>

                  <div className="table-filters">
                    <div className="search-bar">
                      <FaSearch className="search-icon" />
                      <input
                        type="text"
                        placeholder="Search student..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Roll No</th>
                        <th>Grade</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                          <tr key={student.id}>
                            <td>
                              <div className="student-profile">
                                <div className="avatar-badge">
                                  {student.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <span className="student-name">{student.name}</span>
                              </div>
                            </td>
                            <td>{student.rollNo}</td>
                            <td>{student.grade}</td>
                            <td>
                              <span
                                className={`status-badge ${student.status.toLowerCase()}`}
                                onClick={() => cycleStatus(student.id)}
                              >
                                {student.status}
                              </span>
                            </td>
                            <td>
                              <button className="table-action-btn" onClick={() => cycleStatus(student.id)}>
                                <FaEdit />
                                <span>Toggle Status</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="table-empty-state">
                            No students found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Inline Add Student Panel */}
              <div className="add-student-inline-card bg-glass">
                <div className="inline-card-header">
                  <div className="brand-logo-icon" style={{ backgroundColor: "#eff6ff", color: "#3b82f6" }}>
                    <FaUserPlus />
                  </div>
                  <div>
                    <h3>Enroll Student</h3>
                    <p>Add record instantly</p>
                  </div>
                </div>

                <form onSubmit={handleAddStudent} className="inline-form-form">
                  <div className="modal-input-group">
                    <label>Student Name</label>
                    <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1" }}>
                      <FaUser className="input-icon" style={{ fontSize: "16px", left: "16px", color: "#64748b" }} />
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        style={{ height: "48px", paddingLeft: "46px", fontSize: "16px" }}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-input-group">
                    <label>Roll Number</label>
                    <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1" }}>
                      <FaIdCard className="input-icon" style={{ fontSize: "16px", left: "16px", color: "#64748b" }} />
                      <input
                        type="text"
                        placeholder="Enter roll number"
                        value={newStudentRoll}
                        onChange={(e) => setNewStudentRoll(e.target.value)}
                        style={{ height: "48px", paddingLeft: "46px", fontSize: "16px" }}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-input-group">
                    <label>Grade/Class</label>
                    <select value={newStudentGrade} onChange={(e) => setNewStudentGrade(e.target.value)} style={{ height: "48px", fontSize: "16px" }}>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                    </select>
                  </div>

                  <div className="modal-input-group">
                    <label>Default Status</label>
                    <select value={newStudentStatus} onChange={(e) => setNewStudentStatus(e.target.value)} style={{ height: "48px", fontSize: "16px" }}>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                    </select>
                  </div>

                  <button type="submit" className="primary-action-btn inline-submit-btn">
                    <FaUserPlus />
                    <span>Register Student</span>
                  </button>
                </form>
              </div>
            </div>
          </>
        )}

        {/* VIEW 3: ATTENDANCE REPORTS */}
        {activeTab === "reports" && (
          <>
            <header className="content-header">
              <div className="header-welcome">
                <h2>Attendance Analytics</h2>
                <p className="header-date">View summaries and export certified reports</p>
              </div>
            </header>

            {/* Reports top layout */}
            <div className="reports-top-grid">
              {/* Stats Widgets */}
              <div className="reports-analytics-panel">
                <section className="metrics-grid" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="metric-card bg-glass" style={{ padding: "20px 24px" }}>
                    <div className="metric-icon-wrap bg-emerald" style={{ width: "56px", height: "56px" }}>
                      <FaUserCheck className="metric-icon" style={{ fontSize: "24px" }} />
                    </div>
                    <div className="metric-info">
                      <h3 style={{ fontSize: "28px" }}>Grade 10 (96.2%)</h3>
                      <p style={{ fontSize: "14px" }}>Best Attendance Class</p>
                    </div>
                  </div>

                  <div className="metric-card bg-glass" style={{ padding: "20px 24px" }}>
                    <div className="metric-icon-wrap bg-red" style={{ width: "56px", height: "56px" }}>
                      <FaExclamationTriangle className="metric-icon" style={{ fontSize: "24px" }} />
                    </div>
                    <div className="metric-info">
                      <h3 style={{ fontSize: "28px" }}>Grade 11 (82.1%)</h3>
                      <p style={{ fontSize: "14px" }}>Needs Improvement</p>
                    </div>
                  </div>

                  <div className="metric-card bg-glass" style={{ padding: "20px 24px" }}>
                    <div className="metric-icon-wrap bg-blue" style={{ width: "56px", height: "56px" }}>
                      <FaChartLine className="metric-icon" style={{ fontSize: "24px" }} />
                    </div>
                    <div className="metric-info">
                      <h3 style={{ fontSize: "28px" }}>{stats.rate}%</h3>
                      <p style={{ fontSize: "14px" }}>Average Portal Score</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Class Performance Progress Bars */}
              <div className="class-performance-card bg-glass">
                <div className="chart-card-header">
                  <h3>Class Attendance Performance</h3>
                  <span>Academic Target: 90.0% Minimum</span>
                </div>
                <div className="progress-list-container">
                  <div className="progress-item-bar">
                    <div className="progress-info">
                      <span>Grade 10</span>
                      <strong>96.2%</strong>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill bg-emerald-fill" style={{ width: "96.2%" }}></div>
                    </div>
                  </div>

                  <div className="progress-item-bar">
                    <div className="progress-info">
                      <span>Grade 12</span>
                      <strong>94.0%</strong>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill bg-blue-fill" style={{ width: "94.0%" }}></div>
                    </div>
                  </div>

                  <div className="progress-item-bar">
                    <div className="progress-info">
                      <span>Grade 9</span>
                      <strong>91.5%</strong>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill bg-orange-fill" style={{ width: "91.5%" }}></div>
                    </div>
                  </div>

                  <div className="progress-item-bar">
                    <div className="progress-info">
                      <span>Grade 11</span>
                      <strong>82.1%</strong>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill bg-red-fill" style={{ width: "82.1%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="table-card bg-glass">
              <div className="table-card-header">
                <div className="table-title">
                  <h3>Generated Reports Directory</h3>
                  <p>Export attendance logs in PDF or Spreadsheet formats</p>
                </div>

                {/* Custom Date Filters with Large Custom Calendar Picker Panels */}
                <div className="reports-date-filters">

                  {/* FROM date filter */}
                  <div className="modal-input-group date-input" style={{ position: "relative" }}>
                    <label style={{ fontSize: "20px" }}>From</label>
                    <div
                      className="custom-date-field-wrapper"
                      onClick={() => setShowDatePicker(showDatePicker === "start" ? null : "start")}
                    >
                      <FaCalendarAlt className="custom-calendar-field-icon" />
                      <span className="custom-date-field-value">{formatDateDisplay(startDate)}</span>
                    </div>
                    {showDatePicker === "start" && renderCustomCalendar("start")}
                  </div>

                  {/* TO date filter */}
                  <div className="modal-input-group date-input" style={{ position: "relative" }}>
                    <label style={{ fontSize: "20px" }}>To</label>
                    <div
                      className="custom-date-field-wrapper"
                      onClick={() => setShowDatePicker(showDatePicker === "end" ? null : "end")}
                    >
                      <FaCalendarAlt className="custom-calendar-field-icon" />
                      <span className="custom-date-field-value">{formatDateDisplay(endDate)}</span>
                    </div>
                    {showDatePicker === "end" && renderCustomCalendar("end")}
                  </div>

                  <button
                    className="primary-action-btn"
                    style={{ height: "54px", fontSize: "20px", marginTop: "32px" }}
                    onClick={() => triggerSuccessBanner(`Filtered data logs loaded between ${startDate} and ${endDate}.`)}
                  >
                    Filter Logs
                  </button>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>Report Name</th>
                      <th>Timeframe</th>
                      <th>Department Scope</th>
                      <th>File Format</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, name: "June 2026 Monthly Attendance Logs", date: "June 1 - June 30, 2026", scope: "All Classes" },
                      { id: 2, name: "Grade 10 Weekly Report - Week 3", date: "June 15 - June 20, 2026", scope: "Grade 10" },
                      { id: 3, name: "Late Arrival Summary - June", date: "June 1 - June 30, 2026", scope: "All Classes" },
                      { id: 4, name: "Academic Year Parent Alerts Log", date: "Year 2026-2027 Summary", scope: "SMS/Email Logs" }
                    ].map(report => (
                      <tr key={report.id}>
                        <td>
                          <div className="student-profile">
                            <div className="avatar-badge" style={{ backgroundColor: "#fee2e2", color: "#ef4444" }}>
                              <FaFilePdf />
                            </div>
                            <span className="student-name">{report.name}</span>
                          </div>
                        </td>
                        <td>{report.date}</td>
                        <td>{report.scope}</td>
                        <td>
                          <span className="status-badge" style={{ backgroundColor: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1" }}>
                            PDF Document
                          </span>
                        </td>
                        <td>
                          <span className="status-badge present">Generated</span>
                        </td>
                        <td>
                          <button
                            className="table-action-btn"
                            style={{ borderColor: "#10b981", color: "#10b981" }}
                            disabled={downloadingId === report.id}
                            onClick={() => handleDownloadReport(report.name, report.id)}
                          >
                            {downloadingId === report.id ? (
                              <div className="loading-spinner" style={{ width: "14px", height: "14px", borderTopColor: "#10b981", borderLeftColor: "transparent" }}></div>
                            ) : (
                              <FaCloudDownloadAlt />
                            )}
                            <span>{downloadingId === report.id ? "Downloading..." : "Download"}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* VIEW 4: SYSTEM SETTINGS */}
        {activeTab === "settings" && (
          <>
            <header className="content-header">
              <div className="header-welcome">
                <h2>System Configurations</h2>
                <p className="header-date">Manage portal properties, alert thresholds, and rules</p>
              </div>
            </header>

            <form onSubmit={handleSaveSettings} className="settings-form">
              {/* Section 1: General Details */}
              <div className="settings-tab-layout bg-glass">
                <div className="settings-header">
                  <FaUniversity className="settings-header-icon" />
                  <div>
                    <h3>Institutional Profile</h3>
                    <p>Configuration fields shown on generated files</p>
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

              {/* Section 2: Timing Regulations */}
              <div className="settings-tab-layout bg-glass">
                <div className="settings-header">
                  <FaClock className="settings-header-icon" style={{ color: "#f59e0b" }} />
                  <div>
                    <h3>Attendance Limits & Late Marks</h3>
                    <p>Define timers and thresholds for late markers</p>
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
                    <label>Minimum Attendance Threshold</label>
                    <select value={minAttendance} onChange={(e) => setMinAttendance(e.target.value)}>
                      <option value="75%">75% Required</option>
                      <option value="80%">80% Required</option>
                      <option value="85%">85% Required</option>
                      <option value="90%">90% Required</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: SMS and Notifications */}
              <div className="settings-tab-layout bg-glass">
                <div className="settings-header">
                  <FaSms className="settings-header-icon" style={{ color: "#10b981" }} />
                  <div>
                    <h3>SMS Gateway & Automated Notifications</h3>
                    <p>Integrate mobile notifications sent directly to student parent devices</p>
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
                    <label>SMS Text Template (Variables: {'{name}'})</label>
                    <textarea
                      value={smsTemplate}
                      onChange={(e) => setSmsTemplate(e.target.value)}
                      className="settings-textarea"
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="settings-divider"></div>

                <div className="settings-toggles-list">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                    />
                    <span className="checkbox-checkmark"></span>
                    <span className="checkbox-label" style={{ lineHeight: "1.4" }}>
                      Send daily summary emails to Class Teachers and Coordinators
                    </span>
                  </label>

                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                    />
                    <span className="checkbox-checkmark"></span>
                    <span className="checkbox-label" style={{ lineHeight: "1.4" }}>
                      Send instant SMS alerts to parents of absent students upon logger entry
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Action Submit */}
              <div className="settings-actions" style={{ marginBottom: "40px" }}>
                <button type="submit" className="primary-action-btn">
                  <FaSave />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </>
        )}

      </main>
    </div>
  );
}

export default Dashboard;
