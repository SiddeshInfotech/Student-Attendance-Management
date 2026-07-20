/**
 * ReportsTab.jsx
 * ─────────────────────────────────────────────────────────
 * Reports module with:
 * - Period selector: Today, 7/10 days, Last Month, Current Month, Custom
 * - Per-student summary table with Present/Absent/Percentage
 * - Individual student PDF download (improved search UI)
 * - Weekly PDF download (NEW — pick any week)
 * - Monthly PDF download
 * - Bigger date/calendar input boxes
 * ─────────────────────────────────────────────────────────
 */

import { useState, useMemo, useRef, useEffect } from "react";
import {
  FaFilePdf, FaCloudDownloadAlt, FaSearch, FaCalendarAlt,
  FaUserCheck, FaUserTimes, FaChartLine, FaFilter,
  FaUser, FaTimes,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import {
  todayStr, nDaysAgo, formatDate, dateRange,
} from "../../store/useAttendanceStore";

const MONTHS_FULL = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── CSS for date inputs (large, consistent) ───────────────
const dateInputStyle = {
  width: "100%",
  height: "52px",
  padding: "0 16px",
  border: "1.5px solid #cbd5e1",
  borderRadius: "10px",
  fontSize: "15px",
  color: "#0f172a",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  background: "#fff",
  cursor: "pointer",
  transition: "border-color 0.2s",
};

// ── Date range helpers ────────────────────────────────────
const getDateRange = (period, customStart, customEnd) => {
  const today = todayStr();
  const now   = new Date();

  if (period === "today")   return { start: today,           end: today };
  if (period === "7days")   return { start: nDaysAgo(6),     end: today };
  if (period === "10days")  return { start: nDaysAgo(9),     end: today };
  if (period === "lastMonth") {
    const y = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const m = now.getMonth() === 0 ? 12 : now.getMonth();
    const last = new Date(y, m, 0).getDate();
    const mo = String(m).padStart(2, "0");
    return { start: `${y}-${mo}-01`, end: `${y}-${mo}-${last}` };
  }
  if (period === "currentMonth") {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return { start: `${y}-${m}-01`, end: today };
  }
  if (period === "custom") return { start: customStart, end: customEnd };
  return { start: today, end: today };
};

// ── Get Monday of any date's week ─────────────────────────
const getMondayOfWeek = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0=Sun,1=Mon...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
};

const getSundayOfWeek = (mondayStr) => {
  const d = new Date(mondayStr + "T00:00:00");
  d.setDate(d.getDate() + 6);
  return d.toISOString().split("T")[0];
};

// ── PDF: Individual Student Report ────────────────────────
const downloadIndividualPDF = (student, records, schoolName, academicYear) => {
  const doc = new jsPDF();
  const present = records.filter((r) => r.status === "Present").length;
  const absent  = records.filter((r) => r.status === "Absent").length;
  const total   = records.length;
  const pct     = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";

  doc.setFillColor(9, 13, 31);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20); doc.setFont("helvetica", "bold");
  doc.text("SCHOLARTRACK — INDIVIDUAL ATTENDANCE REPORT", 15, 18);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.text(`${schoolName} | Academic Year: ${academicYear}`, 15, 30);

  doc.setTextColor(15, 23, 42);
  doc.setFillColor(240, 249, 255);
  doc.rect(15, 48, 180, 32, "F");
  doc.setFontSize(14); doc.setFont("helvetica", "bold");
  doc.text(student.name, 20, 60);
  doc.setFontSize(11); doc.setFont("helvetica", "normal");
  doc.text(`Roll No: ${student.rollNo}`, 20, 70);
  doc.text(`Class: ${student.grade}  |  Division: ${student.division}`, 20, 76);

  doc.setFillColor(236, 253, 245); doc.rect(15, 88, 54, 20, "F");
  doc.setFillColor(254, 242, 242); doc.rect(77, 88, 54, 20, "F");
  doc.setFillColor(239, 246, 255); doc.rect(139, 88, 56, 20, "F");

  doc.setFontSize(18); doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 95, 70);   doc.text(`${present}`, 32, 101);
  doc.setTextColor(153, 27, 27); doc.text(`${absent}`,  95, 101);
  doc.setTextColor(37, 99, 235); doc.text(`${pct}%`,   155, 101);

  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Present Days", 20, 107);
  doc.text("Absent Days",  82, 107);
  doc.text("Attendance %", 144, 107);

  doc.setFillColor(248, 250, 252);
  doc.rect(15, 116, 180, 8, "F");
  doc.setFontSize(10); doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Date", 20, 122);
  doc.text("Day", 80, 122);
  doc.text("Status", 130, 122);

  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  let y = 130;
  records.forEach((record) => {
    if (y > 270) { doc.addPage(); y = 20; }
    const dayName = DAYS[new Date(record.date + "T00:00:00").getDay()];
    doc.setTextColor(51, 65, 85);
    doc.text(formatDate(record.date), 20, y);
    doc.text(dayName, 80, y);
    doc.setTextColor(record.status === "Present" ? 16 : 239, record.status === "Present" ? 185 : 68, record.status === "Present" ? 129 : 68);
    doc.text(record.status, 130, y);
    doc.setTextColor(226, 232, 240);
    doc.line(15, y + 3, 195, y + 3);
    y += 10;
  });

  doc.save(`${student.name.replace(/\s+/g, "_")}_attendance_report.pdf`);
};

// ── PDF: Weekly Report ────────────────────────────────────
const downloadWeeklyPDF = (weekStart, weekEnd, students, attendanceRecords, schoolName, academicYear) => {
  const doc     = new jsPDF("landscape");
  const dates   = dateRange(weekStart, weekEnd);
  const DAYS    = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const wLabel  = `${formatDate(weekStart)} – ${formatDate(weekEnd)}`;

  doc.setFillColor(9, 13, 31);
  doc.rect(0, 0, 297, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16); doc.setFont("helvetica", "bold");
  doc.text(`Weekly Attendance Report — ${wLabel}`, 15, 14);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text(`${schoolName} | Academic Year: ${academicYear} | Generated: ${formatDate(todayStr())}`, 15, 24);

  const colX   = 15;
  const nameW  = 55;
  const rollW  = 18;
  const cellW  = 28;
  let rowY     = 42;

  // Header row
  doc.setFillColor(248, 250, 252);
  doc.rect(colX, rowY - 6, 297 - 2 * colX, 8, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Student Name", colX + 2, rowY);
  doc.text("Roll", colX + nameW + 2, rowY);

  dates.forEach((d, i) => {
    const dayName = DAYS[new Date(d + "T00:00:00").getDay()];
    const day     = d.split("-")[2];
    const x       = colX + nameW + rollW + 2 + i * cellW;
    doc.text(`${dayName}`, x, rowY - 3);
    doc.text(`${day}`, x + 4, rowY + 3);
  });
  doc.text("Pres", colX + nameW + rollW + 2 + dates.length * cellW + 2, rowY);
  doc.text("Abs",  colX + nameW + rollW + 2 + dates.length * cellW + 16, rowY);
  doc.text("%",    colX + nameW + rollW + 2 + dates.length * cellW + 28, rowY);

  rowY += 6;

  students.forEach((student, si) => {
    if (rowY > 195) { doc.addPage(); rowY = 20; }
    const bg = si % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(...bg);
    doc.rect(colX, rowY - 4, 297 - 2 * colX, 9, "F");

    doc.setFont("helvetica", "normal"); doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(student.name.slice(0, 22), colX + 2, rowY);
    doc.text(student.rollNo, colX + nameW + 2, rowY);

    let pres = 0, abs = 0;
    dates.forEach((d, i) => {
      const rec = attendanceRecords.find((a) => a.studentId === student.id && a.date === d);
      const x   = colX + nameW + rollW + 2 + i * cellW + 4;
      if (rec) {
        if (rec.status === "Present") {
          doc.setTextColor(16, 185, 129); pres++;
          doc.text("P", x, rowY);
        } else {
          doc.setTextColor(239, 68, 68); abs++;
          doc.text("A", x, rowY);
        }
      } else {
        doc.setTextColor(148, 163, 184);
        doc.text("—", x, rowY);
      }
    });

    const total = pres + abs;
    const pct   = total > 0 ? ((pres / total) * 100).toFixed(0) : "0";
    const endX  = colX + nameW + rollW + 2 + dates.length * cellW;
    doc.setTextColor(16, 185, 129);  doc.text(`${pres}`, endX + 2, rowY);
    doc.setTextColor(239, 68, 68);   doc.text(`${abs}`,  endX + 16, rowY);
    doc.setTextColor(pres / (total || 1) >= 0.75 ? 16 : 239, pres / (total || 1) >= 0.75 ? 185 : 68, pres / (total || 1) >= 0.75 ? 129 : 68);
    doc.text(`${pct}%`, endX + 28, rowY);

    rowY += 9;
  });

  doc.save(`weekly_attendance_${weekStart}_to_${weekEnd}.pdf`);
};

// ── PDF: Monthly Report ───────────────────────────────────
const downloadMonthlyPDF = (month, year, students, attendanceRecords, schoolName, academicYear) => {
  const doc      = new jsPDF("landscape");
  const monthStr = MONTHS_FULL[month - 1];
  const lastDay  = new Date(year, month, 0).getDate();
  const mo       = String(month).padStart(2, "0");
  const dates    = dateRange(`${year}-${mo}-01`, `${year}-${mo}-${lastDay}`);

  doc.setFillColor(9, 13, 31);
  doc.rect(0, 0, 297, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16); doc.setFont("helvetica", "bold");
  doc.text(`Monthly Attendance Report — ${monthStr} ${year}`, 15, 14);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text(`${schoolName} | Academic Year: ${academicYear} | Generated: ${formatDate(todayStr())}`, 15, 24);

  const colX  = 15;
  const nameW = 50;
  const cellW = Math.min(6, (297 - colX - nameW - 30) / dates.length);
  let rowY    = 42;

  doc.setFillColor(248, 250, 252);
  doc.rect(colX, rowY - 6, 297 - 2 * colX, 8, "F");
  doc.setFontSize(7); doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Student Name", colX + 2, rowY);
  doc.text("Roll", colX + nameW + 2, rowY);
  dates.forEach((d, i) => {
    doc.text(d.split("-")[2], colX + nameW + 16 + i * cellW, rowY);
  });
  doc.text("Pres", colX + nameW + 16 + dates.length * cellW + 2, rowY);
  doc.text("Abs",  colX + nameW + 16 + dates.length * cellW + 14, rowY);
  rowY += 4;

  students.forEach((student, si) => {
    if (rowY > 195) { doc.addPage(); rowY = 20; }
    const bg = si % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(...bg);
    doc.rect(colX, rowY - 4, 297 - 2 * colX, 8, "F");
    doc.setFont("helvetica", "normal"); doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(student.name.slice(0, 20), colX + 2, rowY);
    doc.text(student.rollNo, colX + nameW + 2, rowY);

    let pres = 0, abs = 0;
    dates.forEach((d, i) => {
      const rec = attendanceRecords.find((a) => a.studentId === student.id && a.date === d);
      if (rec) {
        if (rec.status === "Present") { doc.setTextColor(16, 185, 129); pres++; doc.text("P", colX + nameW + 16 + i * cellW, rowY); }
        else { doc.setTextColor(239, 68, 68); abs++; doc.text("A", colX + nameW + 16 + i * cellW, rowY); }
      } else { doc.setTextColor(148, 163, 184); doc.text("-", colX + nameW + 16 + i * cellW, rowY); }
    });
    doc.setTextColor(16, 185, 129);  doc.text(`${pres}`, colX + nameW + 16 + dates.length * cellW + 4, rowY);
    doc.setTextColor(239, 68, 68);   doc.text(`${abs}`,  colX + nameW + 16 + dates.length * cellW + 14, rowY);
    rowY += 8;
  });

  doc.save(`attendance_${monthStr}_${year}.pdf`);
};

// ═══════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════
function ReportsTab({ store, schoolName, academicYear, triggerBanner }) {
  const { students, attendanceRecords, getRangeSummaryPerStudent, getStudentSummary } = store;

  // Period selector
  const [period, setPeriod]         = useState("currentMonth");
  const [customStart, setCustomStart] = useState(nDaysAgo(30));
  const [customEnd,   setCustomEnd]   = useState(todayStr());

  // Individual report
  const [studentSearch,   setStudentSearch]   = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDropdown,    setShowDropdown]    = useState(false);
  const [indivStart, setIndivStart] = useState(nDaysAgo(29));
  const [indivEnd,   setIndivEnd]   = useState(todayStr());
  const [downloading,    setDownloading]      = useState(false);
  const searchRef = useRef(null);

  // Weekly report
  const [weekDate,  setWeekDate]  = useState(todayStr());
  const [dlWeekly,  setDlWeekly]  = useState(false);

  // Monthly report
  const now = new Date();
  const [monthYear, setMonthYear] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  const [dlMonthly, setDlMonthly] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Date range ───────────────────────────────────────
  const { start, end } = useMemo(
    () => getDateRange(period, customStart, customEnd),
    [period, customStart, customEnd]
  );

  // ── Summary per student ──────────────────────────────
  const summaries = useMemo(
    () => getRangeSummaryPerStudent(start, end),
    [getRangeSummaryPerStudent, start, end]
  );

  const totalPresent = summaries.reduce((acc, s) => acc + s.presentDays, 0);
  const totalAbsent  = summaries.reduce((acc, s) => acc + s.absentDays,  0);
  const totalDays    = totalPresent + totalAbsent;
  const overallPct   = totalDays > 0
    ? parseFloat(((totalPresent / totalDays) * 100).toFixed(1))
    : 0;

  // ── Student search ───────────────────────────────────
  const matchedStudents = useMemo(() => {
    if (!studentSearch.trim()) return students.slice(0, 8);
    const q = studentSearch.trim().toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.grade.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [students, studentSearch]);

  const handleSelectStudent = (s) => {
    setSelectedStudent(s);
    setStudentSearch(s.name);
    setShowDropdown(false);
  };

  const clearStudent = () => {
    setSelectedStudent(null);
    setStudentSearch("");
    setShowDropdown(false);
  };

  // ── Week computed from weekDate ──────────────────────
  const weekStart = getMondayOfWeek(weekDate);
  const weekEnd   = (() => {
    const s = getSundayOfWeek(weekStart);
    return s > todayStr() ? todayStr() : s;
  })();

  // ── Handlers ─────────────────────────────────────────
  const handleIndividualDownload = () => {
    if (!selectedStudent) return;
    setDownloading(true);
    setTimeout(() => {
      const { records } = getStudentSummary(selectedStudent.id, indivStart, indivEnd);
      downloadIndividualPDF(selectedStudent, records, schoolName, academicYear);
      setDownloading(false);
      triggerBanner(`PDF report for ${selectedStudent.name} downloaded!`);
    }, 500);
  };

  const handleWeeklyDownload = () => {
    setDlWeekly(true);
    setTimeout(() => {
      downloadWeeklyPDF(weekStart, weekEnd, students, attendanceRecords, schoolName, academicYear);
      setDlWeekly(false);
      triggerBanner(`Weekly report (${formatDate(weekStart)} – ${formatDate(weekEnd)}) downloaded!`);
    }, 500);
  };

  const handleMonthlyDownload = () => {
    setDlMonthly(true);
    const [y, m] = monthYear.split("-").map(Number);
    setTimeout(() => {
      downloadMonthlyPDF(m, y, students, attendanceRecords, schoolName, academicYear);
      setDlMonthly(false);
      triggerBanner(`Monthly report for ${MONTHS_FULL[m - 1]} ${y} downloaded!`);
    }, 500);
  };

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="content-header">
        <div className="header-welcome">
          <h2>Reports &amp; Analytics</h2>
          <p className="header-date">View summaries and download certified attendance reports</p>
        </div>
      </header>

      {/* ── Period Selector ───────────────────────────────── */}
      <div className="bg-glass history-filter-card">
        <div className="history-period-row">
          <span className="history-filter-label">
            <FaFilter style={{ marginRight: "6px", color: "#3b82f6" }} />
            Period:
          </span>
          <div className="filter-badge-row" style={{ flexWrap: "wrap" }}>
            {[
              { key: "today",        label: "Today" },
              { key: "7days",        label: "Last 7 Days" },
              { key: "10days",       label: "Last 10 Days" },
              { key: "lastMonth",    label: "Last Month" },
              { key: "currentMonth", label: "Current Month" },
              { key: "custom",       label: "Custom Range" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`filter-badge-btn ${period === key ? "active" : ""}`}
                onClick={() => setPeriod(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date range — bigger inputs */}
        {period === "custom" && (
          <div className="history-custom-range" style={{ gap: "20px" }}>
            <div className="modal-input-group" style={{ flex: "1", minWidth: "200px", maxWidth: "300px" }}>
              <label className="reports-date-label">
                <FaCalendarAlt style={{ marginRight: "6px", color: "#3b82f6" }} />
                From Date
              </label>
              <input
                type="date"
                value={customStart}
                max={customEnd}
                onChange={(e) => setCustomStart(e.target.value)}
                style={dateInputStyle}
              />
            </div>
            <div className="modal-input-group" style={{ flex: "1", minWidth: "200px", maxWidth: "300px" }}>
              <label className="reports-date-label">
                <FaCalendarAlt style={{ marginRight: "6px", color: "#10b981" }} />
                To Date
              </label>
              <input
                type="date"
                value={customEnd}
                min={customStart}
                max={todayStr()}
                onChange={(e) => setCustomEnd(e.target.value)}
                style={dateInputStyle}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "2px" }}>
              <div className="reports-date-range-display">
                {formatDate(customStart)} → {formatDate(customEnd)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Summary KPIs ──────────────────────────────────── */}
      <section className="metrics-grid">
        <div className="metric-card bg-glass">
          <div className="metric-icon-wrap bg-emerald"><FaUserCheck className="metric-icon" /></div>
          <div className="metric-info">
            <h3>{totalPresent}</h3>
            <p>Total Present</p>
            <span className="metric-trend text-green">{formatDate(start)} – {formatDate(end)}</span>
          </div>
        </div>
        <div className="metric-card bg-glass">
          <div className="metric-icon-wrap bg-red"><FaUserTimes className="metric-icon" /></div>
          <div className="metric-info">
            <h3>{totalAbsent}</h3>
            <p>Total Absent</p>
            <span className="metric-trend text-red">Across all students</span>
          </div>
        </div>
        <div className="metric-card bg-glass">
          <div className="metric-icon-wrap bg-blue"><FaChartLine className="metric-icon" /></div>
          <div className="metric-info">
            <h3>{overallPct}%</h3>
            <p>Attendance Rate</p>
            <span className={`metric-trend ${overallPct >= 75 ? "text-green" : "text-red"}`}>
              {overallPct >= 75 ? "Good standing" : "Below 75% threshold"}
            </span>
          </div>
        </div>
      </section>

      <div className="reports-panel-grid">
        {/* ── Per-Student Summary Table ─────────────────── */}
        <div className="table-card bg-glass">
          <div className="table-card-header">
            <div className="table-title">
              <h3>Student-wise Summary</h3>
              <p>{formatDate(start)} to {formatDate(end)}</p>
            </div>
          </div>
          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {summaries.length > 0 ? (
                  summaries.map(({ student, presentDays, absentDays, percentage }) => (
                    <tr key={student.id}>
                      <td><strong>{student.rollNo}</strong></td>
                      <td>
                        <div className="student-profile">
                          <div className="avatar-badge">
                            {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="student-name">{student.name}</span>
                        </div>
                      </td>
                      <td>{student.grade}</td>
                      <td>
                        <span className="status-badge present" style={{ cursor: "default" }}>
                          {presentDays}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge absent" style={{ cursor: "default" }}>
                          {absentDays}
                        </span>
                      </td>
                      <td>
                        <div className="pct-cell">
                          <div className="pct-bar-wrap">
                            <div
                              className="pct-bar-fill"
                              style={{
                                width: `${percentage}%`,
                                background: percentage >= 75 ? "#10b981" : "#ef4444",
                              }}
                            />
                          </div>
                          <span
                            className="pct-label"
                            style={{ color: percentage >= 75 ? "#065f46" : "#991b1b" }}
                          >
                            {percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="table-empty-state">
                      No records found for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Right Panel: Download Cards ───────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* ── 1. Individual Student Report ────────────── */}
          <div className="add-student-inline-card bg-glass" style={{ flex: "none" }}>
            <div className="inline-card-header">
              <div className="report-card-icon" style={{ background: "#fef2f2", color: "#ef4444" }}>
                <FaUser style={{ fontSize: "18px" }} />
              </div>
              <div>
                <h3>Individual Student Report</h3>
                <p>Search a student and download their PDF</p>
              </div>
            </div>

            <div className="inline-form-form">
              {/* ── Improved student search ────────────── */}
              <div className="modal-input-group" ref={searchRef} style={{ position: "relative" }}>
                <label className="reports-date-label">
                  <FaSearch style={{ marginRight: "6px", color: "#3b82f6" }} />
                  Search Student
                </label>

                {/* Search input */}
                <div className="indiv-search-wrapper">
                  <FaSearch className="indiv-search-icon" />
                  <input
                    type="text"
                    className="indiv-search-input"
                    placeholder="Type name, roll number or class..."
                    value={studentSearch}
                    autoComplete="off"
                    onChange={(e) => {
                      setStudentSearch(e.target.value);
                      setSelectedStudent(null);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {studentSearch && (
                    <button
                      type="button"
                      className="indiv-search-clear"
                      onClick={clearStudent}
                      title="Clear"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {showDropdown && matchedStudents.length > 0 && (
                  <div className="student-dropdown">
                    {matchedStudents.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className="student-dropdown-item"
                        onMouseDown={() => handleSelectStudent(s)}
                      >
                        <div className="dropdown-item-inner">
                          <div className="dropdown-avatar">
                            {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div className="dropdown-info">
                            <span className="dropdown-name">{s.name}</span>
                            <span className="dropdown-meta">Roll {s.rollNo} · {s.grade} · Div {s.division}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected pill */}
                {selectedStudent && (
                  <div className="selected-student-pill">
                    <FaUserCheck style={{ color: "#10b981", marginRight: "6px" }} />
                    {selectedStudent.name} &nbsp;·&nbsp; Roll {selectedStudent.rollNo} &nbsp;·&nbsp; {selectedStudent.grade}
                    <button type="button" onClick={clearStudent} className="pill-clear-btn">
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>

              {/* Date range — bigger */}
              <div className="settings-form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="modal-input-group">
                  <label className="reports-date-label">
                    <FaCalendarAlt style={{ marginRight: "5px", color: "#3b82f6" }} /> From
                  </label>
                  <input
                    type="date"
                    value={indivStart}
                    max={indivEnd}
                    onChange={(e) => setIndivStart(e.target.value)}
                    style={dateInputStyle}
                  />
                </div>
                <div className="modal-input-group">
                  <label className="reports-date-label">
                    <FaCalendarAlt style={{ marginRight: "5px", color: "#10b981" }} /> To
                  </label>
                  <input
                    type="date"
                    value={indivEnd}
                    min={indivStart}
                    max={todayStr()}
                    onChange={(e) => setIndivEnd(e.target.value)}
                    style={dateInputStyle}
                  />
                </div>
              </div>

              <button
                className="primary-action-btn inline-submit-btn"
                style={{ background: "#ef4444", boxShadow: "0 4px 12px rgba(239,68,68,0.15)" }}
                disabled={!selectedStudent || downloading}
                onClick={handleIndividualDownload}
              >
                {downloading
                  ? <div className="loading-spinner" style={{ width: "16px", height: "16px", borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} />
                  : <FaCloudDownloadAlt />
                }
                <span>{downloading ? "Generating..." : "Download PDF"}</span>
              </button>
            </div>
          </div>

          {/* ── 2. Weekly Report ─────────────────────────── */}
          <div className="add-student-inline-card bg-glass" style={{ flex: "none" }}>
            <div className="inline-card-header">
              <div className="report-card-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                <FaCalendarAlt style={{ fontSize: "18px" }} />
              </div>
              <div>
                <h3>Weekly Report</h3>
                <p>Pick any date — full week (Mon–Sun) downloaded</p>
              </div>
            </div>

            <div className="inline-form-form">
              <div className="modal-input-group">
                <label className="reports-date-label">
                  <FaCalendarAlt style={{ marginRight: "6px", color: "#7c3aed" }} />
                  Any Date in the Week
                </label>
                <input
                  type="date"
                  value={weekDate}
                  max={todayStr()}
                  onChange={(e) => setWeekDate(e.target.value)}
                  style={dateInputStyle}
                />
              </div>

              {/* Week range preview */}
              <div className="week-range-preview">
                <span className="week-label">Selected Week:</span>
                <span className="week-dates">
                  {formatDate(weekStart)} – {formatDate(weekEnd)}
                </span>
              </div>

              <button
                className="primary-action-btn inline-submit-btn"
                style={{ background: "#7c3aed", boxShadow: "0 4px 12px rgba(124,58,237,0.2)" }}
                disabled={dlWeekly}
                onClick={handleWeeklyDownload}
              >
                {dlWeekly
                  ? <div className="loading-spinner" style={{ width: "16px", height: "16px", borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} />
                  : <FaCloudDownloadAlt />
                }
                <span>{dlWeekly ? "Generating..." : "Download Weekly PDF"}</span>
              </button>
            </div>
          </div>

          {/* ── 3. Monthly Report ─────────────────────────── */}
          <div className="add-student-inline-card bg-glass" style={{ flex: "none" }}>
            <div className="inline-card-header">
              <div className="report-card-icon" style={{ background: "#eff6ff", color: "#3b82f6" }}>
                <FaFilePdf style={{ fontSize: "18px" }} />
              </div>
              <div>
                <h3>Monthly Report</h3>
                <p>Full month attendance for all students</p>
              </div>
            </div>

            <div className="inline-form-form">
              <div className="modal-input-group">
                <label className="reports-date-label">
                  <FaCalendarAlt style={{ marginRight: "6px", color: "#3b82f6" }} />
                  Select Month
                </label>
                <input
                  type="month"
                  value={monthYear}
                  max={`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`}
                  onChange={(e) => setMonthYear(e.target.value)}
                  style={{ ...dateInputStyle, height: "52px" }}
                />
              </div>

              <button
                className="primary-action-btn inline-submit-btn"
                style={{ background: "#3b82f6", boxShadow: "0 4px 12px rgba(59,130,246,0.15)" }}
                disabled={dlMonthly}
                onClick={handleMonthlyDownload}
              >
                {dlMonthly
                  ? <div className="loading-spinner" style={{ width: "16px", height: "16px", borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} />
                  : <FaCloudDownloadAlt />
                }
                <span>{dlMonthly ? "Generating..." : "Download Monthly PDF"}</span>
              </button>
            </div>
          </div>

        </div>{/* end right panel */}
      </div>{/* end reports-panel-grid */}
    </>
  );
}

export default ReportsTab;
