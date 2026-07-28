import React, { useState, useMemo } from "react";
import { FaDownload, FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaCalendar } from "react-icons/fa";
import { useAttendanceStore, todayStr, nDaysAgo, dateRange, formatDate } from "../../store/useAttendanceStore";
import { jsPDF } from "jspdf";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getUser } from "../../services/apiClient";

export default function StudentOverviewTab({ currentDate, currentTime }) {
  const store = useAttendanceStore();
  const loggedInUser = getUser();
  
  // Find the student matching the logged-in user
  const student = store.students.find(s => 
    (loggedInUser && s.user === loggedInUser.user_id) || 
    (loggedInUser && s.user_details?.user_id === loggedInUser.user_id) ||
    (loggedInUser && s.name?.toLowerCase() === loggedInUser.full_name?.toLowerCase())
  ) || store.students[0] || {
    id: "s1", name: "Aarav Sharma", rollNo: "101", grade: "Grade 10", division: "A", phone: "9876543210"
  };

  const [timeframe, setTimeframe] = useState("weekly"); // daily, weekly, monthly
  
  // Custom date selection state
  const [selectedWeekDate, setSelectedWeekDate] = useState(todayStr());
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Calculate Date Ranges dynamically based on custom selections
  const dateRanges = useMemo(() => {
    const today = todayStr();
    
    // Weekly bounds
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

    // Monthly bounds
    const [y, m] = selectedMonth.split("-");
    const monthStart = `${y}-${m}-01`;
    const lastDayOfMonth = new Date(y, m, 0).getDate();
    const monthEndCandidate = `${y}-${m}-${lastDayOfMonth}`;
    const monthEnd = monthEndCandidate > today ? today : monthEndCandidate;
    
    // Yearly bounds
    const yearStart = `${selectedYear}-01-01`;
    const yearEndCandidate = `${selectedYear}-12-31`;
    const yearEnd = yearEndCandidate > today ? today : yearEndCandidate;

    return {
      daily: { start: today, end: today },
      weekly: { start: weekStart, end: weekEnd },
      monthly: { start: monthStart, end: monthEnd },
      yearly: { start: yearStart, end: yearEnd }
    };
  }, [selectedWeekDate, selectedMonth, selectedYear]);

  // Get data for the selected timeframe
  const currentRange = dateRanges[timeframe];
  const summary = store.getStudentSummary(student.id, currentRange.start, currentRange.end);
  const records = summary.records; // sorted DESC

  // Prepare chart data (reverse to show chronological order)
  const chartData = useMemo(() => {
    return [...records].reverse().map(r => ({
      date: formatDate(r.date).slice(0, 6), // e.g., "15 Jun"
      fullDate: r.date,
      status: r.status,
      value: r.status === "Present" ? 1 : 0
    }));
  }, [records]);

  // Download PDF
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("Student Attendance Report", 105, 20, { align: "center" });
    
    // Student Info
    doc.setFontSize(12);
    doc.text(`Name: ${student.name}`, 20, 40);
    doc.text(`Roll No: ${student.rollNo}`, 20, 48);
    doc.text(`Class: ${student.grade} - ${student.division}`, 20, 56);
    
    // Summary Stats
    doc.text(`Timeframe: ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`, 130, 40);
    doc.text(`Total Days: ${summary.totalDays}`, 130, 48);
    doc.text(`Present: ${summary.presentDays}`, 130, 56);
    doc.text(`Absent: ${summary.absentDays}`, 130, 64);
    doc.text(`Attendance Rate: ${summary.percentage}%`, 130, 72);

    // Table Header
    doc.setLineWidth(0.5);
    doc.line(20, 85, 190, 85);
    doc.setFont(undefined, 'bold');
    doc.text("Date", 30, 92);
    doc.text("Status", 130, 92);
    doc.line(20, 95, 190, 95);
    
    // Table Body
    doc.setFont(undefined, 'normal');
    let yPos = 105;
    records.forEach((record, idx) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(formatDate(record.date), 30, yPos);
      doc.text(record.status, 130, yPos);
      yPos += 10;
    });

    doc.save(`${student.name.replace(" ", "_")}_Attendance_Report.pdf`);
  };

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
          <h2>{student.name}</h2>
          <div className="sd-profile-tags">
            <span className="sd-tag">Roll No: {student.rollNo}</span>
            <span className="sd-tag">{student.grade} - {student.division}</span>
            <span className="sd-tag">{student.phone}</span>
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

        {/* Date Pickers for Custom Range */}
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
            {records.length > 0 ? records.map(r => (
              <tr key={r.id}>
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
