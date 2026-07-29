import React, { useState, useEffect, useMemo } from "react";
import { FaDownload, FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import { getMyStudentProfile, getStudentAttendanceHistory } from "../../services/authService";
import { getUser } from "../../services/apiClient";
import { jsPDF } from "jspdf";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ── Date Helpers ─────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, day] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(day, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
};

const dateRange = (start, end) => {
  const dates = [];
  const cur = new Date(start + "T00:00:00");
  const last = new Date(end + "T00:00:00");
  while (cur <= last) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

export default function StudentOverviewTab({ currentDate, currentTime }) {
  const loggedInUser = getUser();

  // ── State ──────────────────────────────────────────────
  const [profile, setProfile] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("weekly");

  // Custom date selections
  const [selectedWeekDate, setSelectedWeekDate] = useState(todayStr());
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  // ── Fetch real data from API ───────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profileData = await getMyStudentProfile();
        setProfile(profileData);

        // Fetch attendance history
        const historyData = await getStudentAttendanceHistory(profileData.student_id);
        // Backend returns array of attendance records
        const records = (Array.isArray(historyData) ? historyData : historyData?.results || []).map(r => ({
          id: r.attendance_id || r.id,
          date: r.date,
          status: r.status === "present" ? "Present" : r.status === "absent" ? "Absent" : r.status,
          subject: r.subject_name || null,
        }));
        setAttendanceRecords(records);
      } catch (err) {
        console.warn("Failed to fetch student data from API:", err);
        setError("Could not load your profile. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Date range calculations ────────────────────────────
  const dateRanges = useMemo(() => {
    const today = todayStr();

    const getMonday = (dateStr) => {
      const d = new Date(dateStr + "T00:00:00");
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      return monday.toISOString().split("T")[0];
    };
    const getSunday = (mondayStr) => {
      const d = new Date(mondayStr + "T00:00:00");
      d.setDate(d.getDate() + 6);
      return d.toISOString().split("T")[0];
    };
    const weekStart = getMonday(selectedWeekDate);
    const weekEndCandidate = getSunday(weekStart);
    const weekEnd = weekEndCandidate > today ? today : weekEndCandidate;

    const [y, m] = selectedMonth.split("-");
    const monthStart = `${y}-${m}-01`;
    const lastDayOfMonth = new Date(y, m, 0).getDate();
    const monthEndCandidate = `${y}-${m}-${lastDayOfMonth}`;
    const monthEnd = monthEndCandidate > today ? today : monthEndCandidate;

    return {
      daily: { start: today, end: today },
      weekly: { start: weekStart, end: weekEnd },
      monthly: { start: monthStart, end: monthEnd },
    };
  }, [selectedWeekDate, selectedMonth]);

  // ── Filter records by timeframe ────────────────────────
  const currentRange = dateRanges[timeframe];
  const filteredRecords = useMemo(() => {
    const dateSet = new Set(dateRange(currentRange.start, currentRange.end));
    return attendanceRecords
      .filter(r => dateSet.has(r.date))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [attendanceRecords, currentRange]);

  const summary = useMemo(() => {
    const presentDays = filteredRecords.filter(r => r.status === "Present").length;
    const absentDays = filteredRecords.filter(r => r.status === "Absent").length;
    const totalDays = filteredRecords.length;
    const percentage = totalDays > 0 ? parseFloat(((presentDays / totalDays) * 100).toFixed(1)) : 0;
    return { presentDays, absentDays, totalDays, percentage };
  }, [filteredRecords]);

  // ── Chart data ─────────────────────────────────────────
  const chartData = useMemo(() => {
    return [...filteredRecords].reverse().map(r => ({
      date: formatDate(r.date).slice(0, 6),
      fullDate: r.date,
      status: r.status,
      value: r.status === "Present" ? 1 : 0,
    }));
  }, [filteredRecords]);

  // ── PDF Download ───────────────────────────────────────
  const handleDownloadReport = () => {
    if (!profile) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Student Attendance Report", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Name: ${profile.full_name}`, 20, 40);
    doc.text(`Roll No: ${profile.roll_number}`, 20, 48);
    doc.text(`Class: ${profile.class_name || "N/A"}`, 20, 56);
    doc.text(`Timeframe: ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`, 130, 40);
    doc.text(`Total Days: ${summary.totalDays}`, 130, 48);
    doc.text(`Present: ${summary.presentDays}`, 130, 56);
    doc.text(`Absent: ${summary.absentDays}`, 130, 64);
    doc.text(`Attendance Rate: ${summary.percentage}%`, 130, 72);

    doc.setLineWidth(0.5);
    doc.line(20, 85, 190, 85);
    doc.setFont(undefined, 'bold');
    doc.text("Date", 30, 92);
    doc.text("Status", 130, 92);
    doc.line(20, 95, 190, 95);
    doc.setFont(undefined, 'normal');
    let yPos = 105;
    filteredRecords.forEach((record) => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.text(formatDate(record.date), 30, yPos);
      doc.text(record.status, 130, yPos);
      yPos += 10;
    });
    doc.save(`${profile.full_name.replace(/ /g, "_")}_Attendance_Report.pdf`);
  };

  // ── Loading state ──────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", gap: "12px", color: "#3b82f6" }}>
        <FaSpinner className="spin-animation" style={{ fontSize: "24px", animation: "spin 1s linear infinite" }} />
        <span style={{ fontSize: "16px", fontWeight: 500 }}>Loading your dashboard...</span>
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
  const className = profile?.class_name || "Not Assigned";
  const department = profile?.department || "Not Assigned";
  const mobile = profile?.mobile || "N/A";

  return (
    <div>
      <div className="sd-header">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <h1 className="sd-header-title">Student Dashboard</h1>
          <p style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", margin: 0, fontSize: "1rem" }}>
            <FaCalendarAlt />
            <span>{currentDate}</span>
            <span style={{ fontWeight: 600, color: "#3b82f6", marginLeft: "0.5rem" }}>{currentTime}</span>
          </p>
        </div>
        <button className="sd-download-btn" onClick={handleDownloadReport}>
          <FaDownload /> Download Report
        </button>
      </div>

      {/* Profile Section */}
      <div className="sd-profile-card">
        <img src="https://i.pravatar.cc/150?img=11" alt="Student Avatar" className="sd-avatar" />
        <div className="sd-profile-details">
          <h2>{studentName}</h2>
          <div className="sd-profile-tags">
            <span className="sd-tag">Roll No: {rollNumber}</span>
            <span className="sd-tag">{className}</span>
            {department !== "Not Assigned" && <span className="sd-tag">{department}</span>}
            <span className="sd-tag">{mobile}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="sd-filter-section" style={{ marginBottom: 0 }}>
          <div className="sd-filters">
            <button className={`sd-filter-btn ${timeframe === "daily" ? "active" : ""}`} onClick={() => setTimeframe("daily")}>
               <FaCalendarDay style={{marginRight: "6px"}}/> Daily
            </button>
            <button className={`sd-filter-btn ${timeframe === "weekly" ? "active" : ""}`} onClick={() => setTimeframe("weekly")}>
               <FaCalendarWeek style={{marginRight: "6px"}}/> Weekly
            </button>
            <button className={`sd-filter-btn ${timeframe === "monthly" ? "active" : ""}`} onClick={() => setTimeframe("monthly")}>
               <FaCalendarAlt style={{marginRight: "6px"}}/> Monthly
            </button>
          </div>
        </div>

        {/* Date Pickers */}
        {timeframe === "weekly" && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', minWidth: '420px' }}>
            <span style={{ fontSize: '1rem', color: '#475569', fontWeight: 500 }}>Select a date in the week:</span>
            <input type="date" value={selectedWeekDate} max={todayStr()} onChange={e => setSelectedWeekDate(e.target.value)} style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', flex: 1 }} />
          </div>
        )}
        {timeframe === "monthly" && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '1rem', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', minWidth: '420px' }}>
            <span style={{ fontSize: '1rem', color: '#475569', fontWeight: 500 }}>Select month:</span>
            <input type="month" value={selectedMonth} max={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`} onChange={e => setSelectedMonth(e.target.value)} style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', flex: 1 }} />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="sd-stats-row">
        <div className="sd-stat-card">
          <span className="sd-stat-label">Total Days</span>
          <span className="sd-stat-value">{summary.totalDays}</span>
        </div>
        <div className="sd-stat-card">
          <span className="sd-stat-label">Present</span>
          <span className="sd-stat-value present">{summary.presentDays}</span>
        </div>
        <div className="sd-stat-card">
          <span className="sd-stat-label">Absent</span>
          <span className="sd-stat-value absent">{summary.absentDays}</span>
        </div>
        <div className="sd-stat-card">
          <span className="sd-stat-label">Attendance Rate</span>
          <span className="sd-stat-value">{summary.percentage}%</span>
        </div>
      </div>

      {/* Chart */}
      {timeframe !== "daily" && chartData.length > 0 && (
        <div className="sd-chart-card">
          <span className="sd-chart-title">Attendance Trend</span>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{fontSize: 12, fill: "#64748B"}} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 1]} />
                <Tooltip
                  cursor={{fill: "#F1F5F9"}}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{ background: "#fff", padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: "6px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                          <p style={{ margin: 0, fontWeight: 600 }}>{data.fullDate}</p>
                          <p style={{ margin: "4px 0 0", color: data.status === "Present" ? "#10B981" : "#EF4444" }}>{data.status}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === "Present" ? "#10B981" : "#EF4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="sd-table-container">
        <table className="sd-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? filteredRecords.map(r => (
              <tr key={r.id || r.date}>
                <td>{formatDate(r.date)}</td>
                <td>
                  <span className={`sd-status-badge ${r.status.toLowerCase()}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="2" style={{textAlign: "center", padding: "2rem", color: "#64748B"}}>No attendance records found for this timeframe.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
