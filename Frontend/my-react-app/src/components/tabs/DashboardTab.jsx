/**
 * DashboardTab.jsx
 * ─────────────────────────────────────────────────────────
 * Dashboard overview tab showing KPI cards, weekly trend chart,
 * class breakdown chart, and recent attendance table.
 * ─────────────────────────────────────────────────────────
 */

import {
  FaUsers, FaUserCheck, FaUserTimes, FaCalendarAlt,
  FaUserPlus, FaChartLine,
} from "react-icons/fa";
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend,
} from "recharts";
import { todayStr, formatDate } from "../../store/useAttendanceStore";

// ── Helpers ───────────────────────────────────────────────
const GRADE_COLORS = {
  "Grade 9":  "#f97316",
  "Grade 10": "#3b82f6",
  "Grade 11": "#8b5cf6",
  "Grade 12": "#10b981",
};

function DashboardTab({ store, currentDate, currentTime, setActiveTab }) {
  const { students, attendanceRecords, getTodayStats, getRecentAttendance } = store;

  const todayStats = getTodayStats();
  const recentRecords = getRecentAttendance(15);
  const today = todayStr();

  // ── Weekly chart data (last 7 days) ──────────────────────
  const getWeeklyData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayRecords = attendanceRecords.filter((a) => a.date === dateStr);
      const present = dayRecords.filter((a) => a.status === "Present").length;
      const total = dayRecords.length;
      const rate = total > 0 ? parseFloat(((present / total) * 100).toFixed(1)) : 0;
      days.push({
        day: d.toLocaleDateString("en-IN", { weekday: "short" }),
        rate,
        present,
        absent: total - present,
      });
    }
    return days;
  };

  // ── Class breakdown chart ─────────────────────────────────
  const getClassData = () => {
    const grades = [...new Set(students.map((s) => s.grade))].sort();
    return grades.map((grade) => {
      const classStudents = students.filter((s) => s.grade === grade);
      const todayClassRecords = attendanceRecords.filter(
        (a) => a.date === today && classStudents.some((s) => s.id === a.studentId)
      );
      const present = todayClassRecords.filter((a) => a.status === "Present").length;
      const absent  = todayClassRecords.filter((a) => a.status === "Absent").length;
      return { className: grade.replace("Grade ", "Gr."), Present: present, Absent: absent };
    });
  };

  const weeklyData = getWeeklyData();
  const classData  = getClassData();

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
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
          <button
            className="primary-action-btn"
            style={{ background: "#3b82f6", boxShadow: "0 4px 12px rgba(59,130,246,0.2)" }}
            onClick={() => setActiveTab("attendance")}
          >
            <FaUserCheck />
            <span>Mark Attendance</span>
          </button>
        </div>
      </header>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <section className="metrics-grid">
        <div className="metric-card bg-glass">
          <div className="metric-icon-wrap bg-blue">
            <FaUsers className="metric-icon" />
          </div>
          <div className="metric-info">
            <h3>{todayStats.total}</h3>
            <p>Total Students</p>
            <span className="metric-trend text-green">{students.length} enrolled</span>
          </div>
        </div>

        <div className="metric-card bg-glass">
          <div className="metric-icon-wrap bg-emerald">
            <FaUserCheck className="metric-icon" />
          </div>
          <div className="metric-info">
            <h3>{todayStats.presentToday}</h3>
            <p>Present Today</p>
            <span className="metric-trend text-green">
              {todayStats.hasToday ? `${todayStats.rate}% rate` : "Not marked yet"}
            </span>
          </div>
        </div>

        <div className="metric-card bg-glass">
          <div className="metric-icon-wrap bg-red">
            <FaUserTimes className="metric-icon" />
          </div>
          <div className="metric-info">
            <h3>{todayStats.absentToday}</h3>
            <p>Absent Today</p>
            <span className="metric-trend text-red">
              {todayStats.hasToday ? "Today's absentees" : "No record yet"}
            </span>
          </div>
        </div>

        <div className="metric-card bg-glass">
          <div className="metric-icon-wrap bg-orange">
            <FaChartLine className="metric-icon" />
          </div>
          <div className="metric-info">
            <h3>{todayStats.rate}%</h3>
            <p>Attendance Rate</p>
            <span className={`metric-trend ${todayStats.rate >= 75 ? "text-green" : "text-red"}`}>
              {todayStats.rate >= 75 ? "Good standing" : "Below threshold"}
            </span>
          </div>
        </div>
      </section>

      {/* ── Charts ─────────────────────────────────────────── */}
      <section className="charts-grid">
        {/* Weekly Trend */}
        <div className="chart-card bg-glass">
          <div className="chart-card-header">
            <h3>Weekly Attendance Trend</h3>
            <span>Last 7 Days (%)</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={13} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={13} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff", borderRadius: "12px",
                    border: "1px solid #e2e8f0", fontSize: "13px",
                    fontFamily: "Inter, sans-serif",
                  }}
                  formatter={(val) => [`${val}%`, "Attendance Rate"]}
                />
                <Area
                  type="monotone" dataKey="rate" name="Attendance Rate"
                  stroke="#10b981" strokeWidth={3}
                  fillOpacity={1} fill="url(#colorRate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Breakdown */}
        <div className="chart-card bg-glass">
          <div className="chart-card-header">
            <h3>Attendance by Class</h3>
            <span>Today's Count</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={classData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="className" stroke="#94a3b8" fontSize={13} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={13} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#ffffff", borderRadius: "12px",
                    border: "1px solid #e2e8f0", fontSize: "13px",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "13px" }} />
                <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent"  fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ── Recent Attendance Table ─────────────────────────── */}
      <section className="table-card bg-glass">
        <div className="table-card-header">
          <div className="table-title">
            <h3>Recent Attendance</h3>
            <p>Latest attendance records across all students</p>
          </div>
          <button
            className="table-action-btn"
            onClick={() => setActiveTab("history")}
            style={{ borderColor: "#3b82f6", color: "#3b82f6" }}
          >
            View Full History →
          </button>
        </div>

        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Division</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.length > 0 ? (
                recentRecords.map((record) => (
                  <tr key={record.id}>
                    <td><strong>{record.student.rollNo}</strong></td>
                    <td>
                      <div className="student-profile">
                        <div className="avatar-badge">
                          {record.student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="student-name">{record.student.name}</span>
                      </div>
                    </td>
                    <td>{record.student.grade}</td>
                    <td><span className="division-badge">{record.student.division}</span></td>
                    <td><span className="arrival-time">{formatDate(record.date)}</span></td>
                    <td>
                      <span className={`status-badge ${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="table-empty-state">
                    No attendance records found. Mark attendance to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default DashboardTab;
