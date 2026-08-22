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
import DatePicker from "../ui/DatePicker";

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ── CSS for date inputs (consistent 40px) ───────────────────
const dateInputStyle = {
  width: "100%",
  height: "40px",
  padding: "0 12px",
  border: "1.5px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "13.5px",
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
  const now = new Date();

  if (period === "today") return { start: today, end: today };
  if (period === "7days") return { start: nDaysAgo(6), end: today };
  if (period === "10days") return { start: nDaysAgo(9), end: today };
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

// ── Helper: Get week dates starting Monday ─────────
const getMondayOfWeek = (dStr) => {
  const d = new Date(dStr + "T00:00:00");
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const dayNum = String(monday.getDate()).padStart(2, "0");
  return `${y}-${m}-${dayNum}`;
};

const getSundayOfWeek = (mondayStr) => {
  const d = new Date(mondayStr + "T00:00:00");
  d.setDate(d.getDate() + 6);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dayNum = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dayNum}`;
};

// ── PDF: Individual Student Report ────────────────────────
const downloadIndividualPDF = (student, records, schoolName, academicYear) => {
  const doc = new jsPDF();

  // Sort records chronologically ascending (oldest to newest)
  const sortedRecords = [...records].sort((a, b) => {
    const dA = a.date || a.attendance_date || "";
    const dB = b.date || b.attendance_date || "";
    return dA.localeCompare(dB);
  });

  const present = sortedRecords.filter((r) => r.status === "Present").length;
  const absent = sortedRecords.filter((r) => r.status === "Absent").length;
  const total = sortedRecords.length;
  const pct = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";

  // Banner Header
  doc.setFillColor(9, 13, 31);
  doc.rect(0, 0, 210, 38, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18); doc.setFont("helvetica", "bold");
  doc.text("SCHOLARTRACK — INDIVIDUAL ATTENDANCE REPORT", 15, 18);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.text(`${schoolName} | Academic Year: ${academicYear} | Generated: ${formatDate(todayStr())}`, 15, 29);

  // Student Info Box
  doc.setTextColor(15, 23, 42);
  doc.setFillColor(240, 249, 255);
  doc.rect(15, 45, 180, 30, "F");
  doc.setDrawColor(186, 230, 253);
  doc.rect(15, 45, 180, 30, "S");

  doc.setFontSize(13); doc.setFont("helvetica", "bold");
  doc.text(`Student Name: ${student.name}`, 20, 56);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.text(`Roll Number: ${student.rollNo}    |    Class: ${student.grade}    |    Division: ${student.division}`, 20, 66);

  // Summary Metrics Badges
  doc.setFillColor(236, 253, 245); doc.rect(15, 82, 54, 20, "F");
  doc.setFillColor(254, 242, 242); doc.rect(77, 82, 54, 20, "F");
  doc.setFillColor(239, 246, 255); doc.rect(139, 82, 56, 20, "F");

  doc.setFontSize(16); doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 95, 70); doc.text(`${present}`, 32, 94);
  doc.setTextColor(153, 27, 27); doc.text(`${absent}`, 95, 94);
  doc.setTextColor(37, 99, 235); doc.text(`${pct}%`, 153, 94);

  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Present Days", 20, 99);
  doc.text("Absent Days", 82, 99);
  doc.text("Attendance Rate", 144, 99);

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 108, 180, 8, "F");
  doc.setFontSize(9); doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("S.No", 20, 113.5);
  doc.text("Date", 45, 113.5);
  doc.text("Day", 100, 113.5);
  doc.text("Status", 155, 113.5);

  doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let y = 122;

  if (sortedRecords.length === 0) {
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("No attendance records found for this period (-)", 20, 125);
    y = 135;
  } else {
    sortedRecords.forEach((record, index) => {
      if (y > 265) {
        doc.addPage();
        // Re-draw table header on new page
        doc.setFillColor(241, 245, 249);
        doc.rect(15, 15, 180, 8, "F");
        doc.setFontSize(9); doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text("S.No", 20, 20.5);
        doc.text("Date", 45, 20.5);
        doc.text("Day", 100, 20.5);
        doc.text("Status", 155, 20.5);
        doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
        y = 29;
      }

      const recDate = record.date || record.attendance_date;
      const dayName = recDate ? DAYS[new Date(recDate + "T00:00:00").getDay()] : "-";
      const statusStr = String(record.status || "-").trim();

      doc.setTextColor(51, 65, 85);
      doc.text(`${index + 1}`, 20, y);
      doc.text(formatDate(recDate), 45, y);
      doc.text(dayName, 100, y);

      if (statusStr.toLowerCase() === "present") {
        doc.setTextColor(16, 185, 129);
        doc.text("Present", 155, y);
      } else if (statusStr.toLowerCase() === "absent") {
        doc.setTextColor(239, 68, 68);
        doc.text("Absent", 155, y);
      } else {
        doc.setTextColor(148, 163, 184);
        doc.text("-", 155, y);
      }

      doc.setDrawColor(241, 245, 249);
      doc.line(15, y + 2.5, 195, y + 2.5);
      y += 8.5;
    });
  }

  // Footer Signature Block
  if (y > 250) { doc.addPage(); y = 40; }
  y = Math.max(y + 15, 245);
  doc.setDrawColor(148, 163, 184);
  doc.line(140, y, 190, y);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Authorized Signatory & Stamp", 140, y + 5);

  doc.save(`${student.name.replace(/\s+/g, "_")}_Attendance_Report.pdf`);
};

// ── Fast Lookup Map for O(1) Attendance Retrieval ─────────
const buildAttendanceMap = (records) => {
  const map = new Map();
  if (!records) return map;
  records.forEach((a) => {
    if (!a) return;
    const d = a.date || a.attendance_date;
    if (!d) return;

    const sId1 = String(a.studentId || a.student_id || a.student || "");
    const sRoll = String(a.roll_number || a.rollNo || "").trim().toLowerCase();

    if (sId1) map.set(`${sId1}_${d}`, a);
    if (sRoll) map.set(`roll_${sRoll}_${d}`, a);
  });
  return map;
};

const getRecFromMap = (map, student, date) => {
  if (!student || !date) return null;
  const sId1 = String(student.id || "");
  const sId2 = String(student.student_id || "");
  const sRoll = String(student.rollNo || student.roll_number || "").trim().toLowerCase();

  return (
    (sId1 && map.get(`${sId1}_${date}`)) ||
    (sId2 && map.get(`${sId2}_${date}`)) ||
    (sRoll && map.get(`roll_${sRoll}_${date}`)) ||
    null
  );
};

// ── PDF: Weekly Report ────────────────────────────────────
const downloadWeeklyPDF = (weekStart, weekEnd, students, attendanceRecords, schoolName, academicYear) => {
  const doc = new jsPDF("landscape");
  const dates = dateRange(weekStart, weekEnd);
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const wLabel = `${formatDate(weekStart)} – ${formatDate(weekEnd)}`;
  const attMap = buildAttendanceMap(attendanceRecords);

  // Sort students by Roll Number ascending
  const sortedStudents = [...students].sort((a, b) =>
    a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true })
  );

  doc.setFillColor(9, 13, 31);
  doc.rect(0, 0, 297, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16); doc.setFont("helvetica", "bold");
  doc.text(`Weekly Attendance Summary — ${wLabel}`, 15, 14);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text(`${schoolName} | Academic Year: ${academicYear} | Generated: ${formatDate(todayStr())}`, 15, 24);

  const colX = 15;
  const rollW = 22;
  const nameW = 55;
  // Fixed summary column X positions (anchored from right of 297mm page)
  const presX = 215;  // Total Present column
  const absX = 238;  // Total Absent column
  const rateX = 260;  // Rate % column
  // Compute cell width to fit dates before presX
  const datesStartX = colX + rollW + nameW + 2;
  const availW = presX - datesStartX - 2;
  const cellW = dates.length > 0 ? Math.min(24, availW / dates.length) : 24;
  let rowY = 42;

  // Header row
  doc.setFillColor(241, 245, 249);
  doc.rect(colX, rowY - 6, 297 - 2 * colX, 10, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Roll No", colX + 2, rowY);
  doc.text("Student Name", colX + rollW + 2, rowY);

  dates.forEach((d, i) => {
    const dayName = DAYS[new Date(d + "T00:00:00").getDay()];
    const dayNum = d.split("-")[2];
    const x = datesStartX + i * cellW;
    doc.text(`${dayName}`, x, rowY - 2);
    doc.text(`${dayNum}`, x + 2, rowY + 3);
  });

  doc.text("Total Present", presX, rowY);
  doc.text("Total Absent", absX, rowY);
  doc.text("Rate %", rateX, rowY);

  rowY += 8;

  sortedStudents.forEach((student, si) => {
    if (rowY > 185) {
      doc.addPage();
      rowY = 25;
      // Re-draw header on new page
      doc.setFillColor(241, 245, 249);
      doc.rect(colX, rowY - 6, 297 - 2 * colX, 10, "F");
      doc.setFontSize(8); doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("Roll No", colX + 2, rowY);
      doc.text("Student Name", colX + rollW + 2, rowY);
      dates.forEach((d, i) => {
        const dayName = DAYS[new Date(d + "T00:00:00").getDay()];
        const dayNum = d.split("-")[2];
        const x = datesStartX + i * cellW;
        doc.text(`${dayName}`, x, rowY - 2);
        doc.text(`${dayNum}`, x + 2, rowY + 3);
      });
      doc.text("Total Present", presX, rowY);
      doc.text("Total Absent", absX, rowY);
      doc.text("Rate %", rateX, rowY);
      rowY += 8;
    }

    const bg = si % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(...bg);
    doc.rect(colX, rowY - 4, 297 - 2 * colX, 9, "F");

    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(student.rollNo, colX + 2, rowY);
    doc.text(student.name.slice(0, 22), colX + rollW + 2, rowY);

    let pres = 0, abs = 0;
    dates.forEach((d, i) => {
      const rec = getRecFromMap(attMap, student, d);
      const x = datesStartX + i * cellW + 3;
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
        doc.text("-", x, rowY);
      }
    });

    const total = pres + abs;
    const pct = total > 0 ? ((pres / total) * 100).toFixed(0) : "0";
    doc.setTextColor(16, 185, 129); doc.text(`${pres}`, presX + 4, rowY);
    doc.setTextColor(239, 68, 68); doc.text(`${abs}`, absX + 4, rowY);
    doc.setTextColor(pct >= 75 ? 16 : 239, pct >= 75 ? 185 : 68, pct >= 75 ? 129 : 68);
    doc.setFont("helvetica", "bold");
    doc.text(`${pct}%`, rateX + 2, rowY);

    rowY += 9;
  });

  doc.save(`Weekly_Attendance_${weekStart}_to_${weekEnd}.pdf`);
};

// ── PDF: Monthly Report ───────────────────────────────────
const downloadMonthlyPDF = (month, year, students, attendanceRecords, schoolName, academicYear) => {
  const doc = new jsPDF("landscape");
  const monthStr = MONTHS_FULL[month - 1];
  const lastDay = new Date(year, month, 0).getDate();
  const mo = String(month).padStart(2, "0");
  const dates = dateRange(`${year}-${mo}-01`, `${year}-${mo}-${lastDay}`);
  const attMap = buildAttendanceMap(attendanceRecords);

  // Sort students by Roll Number ascending
  const sortedStudents = [...students].sort((a, b) =>
    a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true })
  );

  doc.setFillColor(9, 13, 31);
  doc.rect(0, 0, 297, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16); doc.setFont("helvetica", "bold");
  doc.text(`Monthly Attendance Report — ${monthStr} ${year}`, 15, 14);
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text(`${schoolName} | Academic Year: ${academicYear} | Generated: ${formatDate(todayStr())}`, 15, 24);

  const colX = 12;
  const rollW = 14;
  const nameW = 44;
  // Fixed summary column X positions anchored from right
  const presX = 230;  // Total Present
  const absX = 250;  // Total Absent
  const pctX = 270;  // Percentage
  // Compute cell width to fit all dates before presX
  const datesStartX = colX + rollW + nameW + 1;
  const availW = presX - datesStartX - 2;
  const cellW = dates.length > 0 ? Math.max(4.5, Math.min(7, availW / dates.length)) : 5.5;
  let rowY = 42;

  // Header row
  doc.setFillColor(241, 245, 249);
  doc.rect(colX, rowY - 6, 297 - 2 * colX, 8, "F");
  doc.setFontSize(7); doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("Roll No", colX + 2, rowY);
  doc.text("Student Name", colX + rollW + 2, rowY);

  dates.forEach((d, i) => {
    const dayNum = parseInt(d.split("-")[2], 10);
    doc.text(`${dayNum}`, datesStartX + i * cellW, rowY);
  });

  doc.text("Total Present", presX, rowY);
  doc.text("Total Absent", absX, rowY);
  doc.text("Percentage", pctX, rowY);
  rowY += 6;

  sortedStudents.forEach((student, si) => {
    if (rowY > 185) {
      doc.addPage();
      rowY = 22;
      // Re-draw header on new page
      doc.setFillColor(241, 245, 249);
      doc.rect(colX, rowY - 6, 297 - 2 * colX, 8, "F");
      doc.setFontSize(7); doc.setFont("helvetica", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text("Roll No", colX + 2, rowY);
      doc.text("Student Name", colX + rollW + 2, rowY);
      dates.forEach((d, i) => {
        const dayNum = parseInt(d.split("-")[2], 10);
        doc.text(`${dayNum}`, datesStartX + i * cellW, rowY);
      });
      doc.text("Total Present", presX, rowY);
      doc.text("Total Absent", absX, rowY);
      doc.text("Percentage", pctX, rowY);
      rowY += 6;
    }

    const bg = si % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(...bg);
    doc.rect(colX, rowY - 4, 297 - 2 * colX, 7.5, "F");
    doc.setFont("helvetica", "normal"); doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(student.rollNo, colX + 2, rowY);
    doc.text(student.name.slice(0, 18), colX + rollW + 2, rowY);

    let pres = 0, abs = 0;
    dates.forEach((d, i) => {
      const rec = getRecFromMap(attMap, student, d);
      const x = datesStartX + i * cellW;
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
        doc.text("-", x, rowY);
      }
    });

    const total = pres + abs;
    const pct = total > 0 ? ((pres / total) * 100).toFixed(0) : "0";
    doc.setTextColor(16, 185, 129); doc.text(`${pres}`, presX + 4, rowY);
    doc.setTextColor(239, 68, 68); doc.text(`${abs}`, absX + 4, rowY);
    doc.setTextColor(pct >= 75 ? 16 : 239, pct >= 75 ? 185 : 68, pct >= 75 ? 129 : 68);
    doc.setFont("helvetica", "bold");
    doc.text(`${pct}%`, pctX + 2, rowY);

    rowY += 7.5;
  });

  doc.save(`Monthly_Attendance_${monthStr}_${year}.pdf`);
};

// ═══════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════
function ReportsTab({ store, schoolName, academicYear, triggerBanner }) {
  const { students, attendanceRecords, getRangeSummaryPerStudent, getStudentSummary } = store;

  // Period selector
  const [period, setPeriod] = useState("currentMonth");
  const [customStart, setCustomStart] = useState(nDaysAgo(30));
  const [customEnd, setCustomEnd] = useState(todayStr());

  // Individual report
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [indivStart, setIndivStart] = useState(nDaysAgo(29));
  const [indivEnd, setIndivEnd] = useState(todayStr());
  const [downloading, setDownloading] = useState(false);
  const searchRef = useRef(null);

  // Weekly report
  const [weekDate, setWeekDate] = useState(todayStr());
  const [dlWeekly, setDlWeekly] = useState(false);

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
  const totalAbsent = summaries.reduce((acc, s) => acc + s.absentDays, 0);
  const totalDays = totalPresent + totalAbsent;
  const overallPct = totalDays > 0
    ? parseFloat(((totalPresent / totalDays) * 100).toFixed(1))
    : 0;

  // ── Student search ───────────────────────────────────
  const matchedStudents = useMemo(() => {
    let list = students;
    if (studentSearch.trim()) {
      const q = studentSearch.trim().toLowerCase();
      list = students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.grade.toLowerCase().includes(q)
      );
    }
    return [...list]
      .sort((a, b) => {
        const numA = parseInt(a.rollNo, 10);
        const numB = parseInt(b.rollNo, 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return String(a.rollNo || "").localeCompare(String(b.rollNo || ""), undefined, { numeric: true, sensitivity: "base" });
      })
      .slice(0, 8);
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
  const weekEnd = (() => {
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
    }, 20);
  };

  const handleWeeklyDownload = () => {
    setDlWeekly(true);
    setTimeout(() => {
      downloadWeeklyPDF(weekStart, weekEnd, students, attendanceRecords, schoolName, academicYear);
      setDlWeekly(false);
      triggerBanner(`Weekly report (${formatDate(weekStart)} – ${formatDate(weekEnd)}) downloaded!`);
    }, 20);
  };

  const handleMonthlyDownload = () => {
    setDlMonthly(true);
    const [y, m] = monthYear.split("-").map(Number);
    setTimeout(() => {
      downloadMonthlyPDF(m, y, students, attendanceRecords, schoolName, academicYear);
      setDlMonthly(false);
      triggerBanner(`Monthly report for ${MONTHS_FULL[m - 1]} ${y} downloaded!`);
    }, 20);
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
              { key: "today", label: "Today" },
              { key: "7days", label: "Last 7 Days" },
              { key: "10days", label: "Last 10 Days" },
              { key: "lastMonth", label: "Last Month" },
              { key: "currentMonth", label: "Current Month" },
              { key: "custom", label: "Custom Range" },
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
              <DatePicker
                value={customStart}
                max={customEnd}
                onChange={(dateStr) => setCustomStart(dateStr)}
                style={dateInputStyle}
                placeholder="From Date"
              />
            </div>
            <div className="modal-input-group" style={{ flex: "1", minWidth: "200px", maxWidth: "300px" }}>
              <label className="reports-date-label">
                <FaCalendarAlt style={{ marginRight: "6px", color: "#10b981" }} />
                To Date
              </label>
              <DatePicker
                value={customEnd}
                min={customStart}
                max={todayStr()}
                onChange={(dateStr) => setCustomEnd(dateStr)}
                style={dateInputStyle}
                placeholder="To Date"
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

      {/* ── Per-Student Summary Table (Full Width) ─────────────────── */}
      <div className="table-card bg-glass" style={{ marginBottom: "1.75rem" }}>
        <div className="table-card-header">
          <div className="table-title">
            <h3>Student-wise Summary</h3>
            <p>{formatDate(start)} to {formatDate(end)}</p>
          </div>
        </div>
        <div className="table-wrapper">
          <table className="student-table" style={{ tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              <col style={{ width: "8%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Roll No</th>
                <th>Student Name</th>
                <th>Department</th>
                <th>Year</th>
                <th style={{ textAlign: "center" }}>Present</th>
                <th style={{ textAlign: "center" }}>Absent</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {summaries.length > 0 ? (
                summaries.map(({ student, presentDays, absentDays, percentage }) => (
                  <tr key={student.id}>
                    <td style={{ textAlign: "center" }}><strong>{student.rollNo}</strong></td>
                    <td>
                      <div className="student-profile">
                        <div className="avatar-badge">
                          {student.name ? student.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "S"}
                        </div>
                        <span className="student-name">{student.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "13.5px", color: "#334155" }}>
                        {student.department || "Computer Engineering"}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{student.grade || "1st Year"}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className="count-badge present">
                        {presentDays}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className="count-badge absent">
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
                  <td colSpan="7" className="table-empty-state">
                    No records found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Download Reports Row (Three Cards Side-by-Side at Bottom) ─────────── */}
      <div className="reports-download-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem", alignItems: "stretch", marginBottom: "2rem" }}>

        {/* ── 1. Individual Student Report ────────────── */}
        <div className="add-student-inline-card bg-glass" style={{ flex: "none", margin: 0, display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
          <div className="inline-card-header">
            <div className="report-card-icon" style={{ background: "#fef2f2", color: "#ef4444" }}>
              <FaUser style={{ fontSize: "18px" }} />
            </div>
            <div>
              <h3>Individual Student Report</h3>
              <p>Search a student and download their PDF</p>
            </div>
          </div>

          <div className="inline-form-form" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* ── Improved student search ────────────── */}
              <div className="modal-input-group" ref={searchRef} style={{ position: "relative" }}>
                <label className="reports-date-label">
                  <FaSearch style={{ marginRight: "10px", color: "#3b82f6" }} />
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

              {/* Date range */}
              <div className="settings-form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="modal-input-group">
                  <label className="reports-date-label">
                    <FaCalendarAlt style={{ marginRight: "5px", color: "#3b82f6" }} /> From
                  </label>
                  <DatePicker
                    value={indivStart}
                    max={indivEnd}
                    onChange={(dateStr) => setIndivStart(dateStr)}
                    style={dateInputStyle}
                    placeholder="From Date"
                  />
                </div>
                <div className="modal-input-group">
                  <label className="reports-date-label">
                    <FaCalendarAlt style={{ marginRight: "5px", color: "#10b981" }} /> To
                  </label>
                  <DatePicker
                    value={indivEnd}
                    min={indivStart}
                    max={todayStr()}
                    onChange={(dateStr) => setIndivEnd(dateStr)}
                    style={dateInputStyle}
                    placeholder="To Date"
                  />
                </div>
              </div>
            </div>

            <button
              className="primary-action-btn inline-submit-btn"
              style={{ background: "#ef4444", boxShadow: "0 4px 12px rgba(239,68,68,0.15)", marginTop: "14px" }}
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
        <div className="add-student-inline-card bg-glass" style={{ flex: "none", margin: 0, display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
          <div className="inline-card-header">
            <div className="report-card-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
              <FaCalendarAlt style={{ fontSize: "18px" }} />
            </div>
            <div>
              <h3>Weekly Report</h3>
              <p>Pick any date — full week (Mon–Sun) downloaded</p>
            </div>
          </div>

          <div className="inline-form-form" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="modal-input-group">
                <label className="reports-date-label">
                  <FaCalendarAlt style={{ marginRight: "6px", color: "#7c3aed" }} />
                  Any Date in the Week
                </label>
                <DatePicker
                  value={weekDate}
                  max={todayStr()}
                  onChange={(dateStr) => setWeekDate(dateStr)}
                  style={dateInputStyle}
                  placeholder="Select Date"
                />
              </div>

              <div className="week-range-preview">
                <span className="week-label">Selected Week:</span>
                <span className="week-dates">
                  {formatDate(weekStart)} – {formatDate(weekEnd)}
                </span>
              </div>
            </div>

            <button
              className="primary-action-btn inline-submit-btn"
              style={{ background: "#7c3aed", boxShadow: "0 4px 12px rgba(124,58,237,0.2)", marginTop: "14px" }}
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
        <div className="add-student-inline-card bg-glass" style={{ flex: "none", margin: 0, display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
          <div className="inline-card-header">
            <div className="report-card-icon" style={{ background: "#eff6ff", color: "#3b82f6" }}>
              <FaFilePdf style={{ fontSize: "18px" }} />
            </div>
            <div>
              <h3>Monthly Report</h3>
              <p>Full month attendance for all students</p>
            </div>
          </div>

          <div className="inline-form-form" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
                  style={{ ...dateInputStyle, height: "42px" }}
                />
              </div>
            </div>

            <button
              className="primary-action-btn inline-submit-btn"
              style={{ background: "#3b82f6", boxShadow: "0 4px 12px rgba(59,130,246,0.15)", marginTop: "14px" }}
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

      </div>{/* end reports-download-row */}
    </>
  );
}

export default ReportsTab;
