import React, { useState, useEffect, useMemo } from "react";
import { FaDownload, FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import { getStudentDashboard } from "../../services/authService";
import { jsPDF } from "jspdf";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function StudentOverviewTab({ currentDate, currentTime }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("monthly"); // daily, weekly, monthly

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getStudentDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const student = dashboardData?.student || dashboardData?.profile || {};
  const summary = dashboardData?.summary || {};
  const timeframes = dashboardData?.timeframes || {};
  const allRecords = dashboardData?.records || dashboardData?.history || [];

  // Filter records based on timeframe tab
  const filteredRecords = useMemo(() => {
    if (!allRecords || allRecords.length === 0) return [];
    if (timeframe === "daily") {
      const todayStr = new Date().toISOString().split("T")[0];
      return allRecords.filter(r => r.date === todayStr);
    }
    if (timeframe === "weekly") {
      return allRecords.slice(0, 7);
    }
    return allRecords.slice(0, 30);
  }, [allRecords, timeframe]);

  // Compute active statistics based on selected timeframe
  const activeStats = useMemo(() => {
    if (timeframe === "weekly" && timeframes.weekly) {
      return {
        totalDays: timeframes.weekly.total,
        presentDays: timeframes.weekly.present,
        absentDays: timeframes.weekly.total - timeframes.weekly.present,
        percentage: timeframes.weekly.percentage
      };
    }
    if (timeframe === "daily" && timeframes.daily) {
      const isPresent = timeframes.daily.status?.toLowerCase() === "present";
      return {
        totalDays: timeframes.daily.status === "Not Marked Today" ? 0 : 1,
        presentDays: isPresent ? 1 : 0,
        absentDays: !isPresent && timeframes.daily.status !== "Not Marked Today" ? 1 : 0,
        percentage: isPresent ? 100 : 0
      };
    }
    return {
      totalDays: summary.totalDays ?? summary.total_days ?? 0,
      presentDays: summary.presentDays ?? summary.present_count ?? 0,
      absentDays: summary.absentDays ?? summary.absent_count ?? 0,
      percentage: summary.percentage ?? summary.attendance_percentage ?? 0
    };
  }, [timeframe, summary, timeframes]);

  // Dynamic Chart Data
  const chartData = useMemo(() => {
    const rawGraph = dashboardData?.graph_data || [];
    if (rawGraph.length > 0) {
      if (timeframe === "weekly") return rawGraph.slice(-7);
      if (timeframe === "daily") return rawGraph.slice(-1);
      return rawGraph;
    }
    return [...filteredRecords].reverse().map(r => ({
      date: r.date ? r.date.slice(5) : "",
      fullDate: r.date || "",
      status: r.status || "Present",
      value: r.status?.toLowerCase() === "present" ? 1 : 0
    }));
  }, [dashboardData, filteredRecords, timeframe]);

  // Download PDF Report
  const handleDownloadReport = () => {
    if (!student.name) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("Student Attendance Report", 105, 20, { align: "center" });
    
    // Student Info
    doc.setFontSize(12);
    doc.text(`Name: ${student.name || student.full_name}`, 20, 40);
    doc.text(`Roll No: ${student.roll_number || student.rollNo || "N/A"}`, 20, 48);
    doc.text(`Class: ${student.class_name || student.grade} - ${student.division_name || student.division}`, 20, 56);
    doc.text(`Email: ${student.email}`, 20, 64);
    
    // Summary Stats
    doc.text(`Report Period: ${timeframe.toUpperCase()}`, 130, 40);
    doc.text(`Total Days: ${activeStats.totalDays}`, 130, 48);
    doc.text(`Present: ${activeStats.presentDays}`, 130, 56);
    doc.text(`Absent: ${activeStats.absentDays}`, 130, 64);
    doc.text(`Attendance Rate: ${activeStats.percentage}%`, 130, 72);

    // Table Header
    doc.setLineWidth(0.5);
    doc.line(20, 80, 190, 80);
    doc.setFont(undefined, 'bold');
    doc.text("Date", 30, 87);
    doc.text("Status", 110, 87);
    doc.text("Remarks", 150, 87);
    doc.line(20, 90, 190, 90);
    
    // Table Body
    doc.setFont(undefined, 'normal');
    let yPos = 100;
    filteredRecords.forEach((record) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(String(record.date || ""), 30, yPos);
      doc.text(String(record.status || ""), 110, yPos);
      doc.text(String(record.remarks || "-"), 150, yPos);
      yPos += 10;
    });

    const safeName = (student.name || "Student").replace(/\s+/g, "_");
    doc.save(`${safeName}_Attendance_Report.pdf`);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "350px", color: "#3b82f6" }}>
        <FaSpinner className="sd-spinner" size={32} style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ marginTop: "1rem", color: "#64748b" }}>Loading database attendance information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", background: "#fef2f2", borderRadius: "12px", border: "1px solid #fca5a5", color: "#991b1b" }}>
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={loadDashboard} style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header Bar */}
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

      {/* Dynamic Profile Summary Header */}
      <div className="sd-profile-card">
        <img
          src={student.profile_image || "https://i.pravatar.cc/150?img=11"}
          alt={student.name || "Student Avatar"}
          className="sd-avatar"
        />
        <div className="sd-profile-details">
          <h2>{student.name || student.full_name}</h2>
          <div className="sd-profile-tags">
            <span className="sd-tag">Roll No: {student.roll_number || student.rollNo || "N/A"}</span>
            <span className="sd-tag">{student.class_name || student.grade || "10th"} - {student.division_name || student.division || "A"}</span>
            <span className="sd-tag">{student.phone_number || student.mobile || student.email}</span>
          </div>
        </div>
      </div>

      {/* Timeframe Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="sd-filter-section" style={{ marginBottom: 0 }}>
          <div className="sd-filters">
            <button
              className={`sd-filter-btn ${timeframe === "daily" ? "active" : ""}`}
              onClick={() => setTimeframe("daily")}
            >
              <FaCalendarDay style={{ marginRight: "6px" }} /> Daily
            </button>
            <button
              className={`sd-filter-btn ${timeframe === "weekly" ? "active" : ""}`}
              onClick={() => setTimeframe("weekly")}
            >
              <FaCalendarWeek style={{ marginRight: "6px" }} /> Weekly
            </button>
            <button
              className={`sd-filter-btn ${timeframe === "monthly" ? "active" : ""}`}
              onClick={() => setTimeframe("monthly")}
            >
              <FaCalendarAlt style={{ marginRight: "6px" }} /> Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Stats Row */}
      <div className="sd-stats-row">
        <div className="sd-stat-card">
          <span className="sd-stat-label">Total Days</span>
          <span className="sd-stat-value">{activeStats.totalDays}</span>
        </div>
        <div className="sd-stat-card">
          <span className="sd-stat-label">Present</span>
          <span className="sd-stat-value present">{activeStats.presentDays}</span>
        </div>
        <div className="sd-stat-card">
          <span className="sd-stat-label">Absent</span>
          <span className="sd-stat-value absent">{activeStats.absentDays}</span>
        </div>
        <div className="sd-stat-card">
          <span className="sd-stat-label">Attendance Rate</span>
          <span className="sd-stat-value">{activeStats.percentage}%</span>
        </div>
      </div>

      {/* Dynamic Chart */}
      {timeframe !== "daily" && chartData.length > 0 && (
        <div className="sd-chart-card">
          <span className="sd-chart-title">Attendance Trend ({timeframe.toUpperCase()})</span>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 1]} />
                <Tooltip
                  cursor={{ fill: "#F1F5F9" }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{ background: "#fff", padding: "8px 12px", border: "1px solid #E2E8F0", borderRadius: "6px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                          <p style={{ margin: 0, fontWeight: 600 }}>{data.fullDate || data.date}</p>
                          <p style={{ margin: "4px 0 0", color: data.status === "Present" ? "#10B981" : "#EF4444" }}>
                            {data.status}
                          </p>
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

      {/* Dynamic Attendance History Data Table */}
      <div className="sd-table-container">
        <h3 style={{ margin: "1rem 1.25rem 0.5rem", fontSize: "1.1rem", color: "#1e293b" }}>
          Attendance History
        </h3>
        <table className="sd-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((r, idx) => (
                <tr key={r.id || idx}>
                  <td>{r.formatted_date || r.date}</td>
                  <td>
                    <span className={`sd-status-badge ${r.status?.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ color: "#64748b" }}>{r.remarks || "On time"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "2rem", color: "#64748B" }}>
                  No attendance records found in database for this timeframe.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
