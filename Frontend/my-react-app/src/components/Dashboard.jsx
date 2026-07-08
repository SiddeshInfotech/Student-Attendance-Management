import { useState } from "react";
import "../styles/Dashboard.css";

import Students from "./Students";
import Attendance from "./Attendance";
import Reports from "./Reports";
import Settings from "./Settings";

import {
  FaUserGraduate,
  FaUsers,
  FaClipboardCheck,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaUserCheck,
  FaUserTimes,
  FaChalkboardTeacher,
  FaArrowUp
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function Dashboard({ logout }) {

  const [activePage, setActivePage] = useState("dashboard");

  const attendanceData = [
    { name: "Mon", present: 80 },
    { name: "Tue", present: 95 },
    { name: "Wed", present: 70 },
    { name: "Thu", present: 90 },
    { name: "Fri", present: 85 },
  ];

  return (

<div className="dashboard">

{/* ================= SIDEBAR ================= */}

<div className="sidebar">

<div className="logo">

<div className="logo-icon">
<FaUserGraduate />
</div>

<div>
<h2>SAMS</h2>
<p>Admin Panel</p>
</div>

</div>

<ul>

<li
className={activePage==="dashboard" ? "active" : ""}
onClick={()=>setActivePage("dashboard")}
>
<FaChartLine />
<span>Dashboard</span>
</li>

<li
className={activePage==="students" ? "active" : ""}
onClick={()=>setActivePage("students")}
>
<FaUsers />
<span>Students</span>
</li>

<li
className={activePage==="attendance" ? "active" : ""}
onClick={()=>setActivePage("attendance")}
>
<FaClipboardCheck />
<span>Attendance</span>
</li>

<li
className={activePage==="reports" ? "active" : ""}
onClick={()=>setActivePage("reports")}
>
<FaChartLine />
<span>Reports</span>
</li>

<li
className={activePage==="settings" ? "active" : ""}
onClick={()=>setActivePage("settings")}
>
<FaCog />
<span>Settings</span>
</li>

<li
className="logout"
onClick={logout}
>
<FaSignOutAlt />
<span>Logout</span>
</li>

</ul>

</div>

{/* ================= MAIN ================= */}

<div className="main">

{/* NAVBAR */}

<div className="navbar">

<div>

<h2>Student Attendance Management System</h2>

<p>
Welcome back, Admin 👋
</p>

</div>

<div className="nav-right">

<div className="search-box">

<FaSearch />

<input
type="text"
placeholder="Search students..."
/>

</div>

<div className="notification">

<FaBell />

<span>3</span>

</div>

<div className="profile">

<div className="avatar">
<FaUserCircle />
</div>

<div>
<h4>Admin</h4>
<small>Administrator</small>
</div>

</div>

</div>

</div>

{/* ================= PAGE CONTENT ================= */}

{activePage === "dashboard" && (
<>
{/* ================= DASHBOARD HOME ================= */}

<div className="cards">

  <div className="dashboard-card blue">

    <div className="card-top">

      <h3>
        <FaUsers />
        Total Students
      </h3>

      <div className="circle">
        <FaArrowUp />
      </div>

    </div>

    <h1>250</h1>

    <p>+10 New Students This Month</p>

  </div>

  <div className="dashboard-card green">

    <div className="card-top">

      <h3>
        <FaUserCheck />
        Present Today
      </h3>

      <div className="circle">
        <FaArrowUp />
      </div>

    </div>

    <h1>220</h1>

    <p>88% Attendance Rate</p>

  </div>

  <div className="dashboard-card red">

    <div className="card-top">

      <h3>
        <FaUserTimes />
        Absent Today
      </h3>

      <div className="circle">
        <FaArrowUp />
      </div>

    </div>

    <h1>30</h1>

    <p>12% Students Absent</p>

  </div>

  <div className="dashboard-card orange">

    <div className="card-top">

      <h3>
        <FaChalkboardTeacher />
        Total Classes
      </h3>

      <div className="circle">
        <FaArrowUp />
      </div>

    </div>

    <h1>18</h1>

    <p>Running Successfully</p>

  </div>

</div>

{/* ANALYTICS */}

<div className="analytics">

  <div className="chart-box">

    <h2>Weekly Attendance Report</h2>

    <ResponsiveContainer width="100%" height={300}>

      <BarChart data={attendanceData}>

        <CartesianGrid strokeDasharray="3 3"/>

        <XAxis dataKey="name"/>

        <YAxis/>

        <Tooltip/>

        <Bar
          dataKey="present"
          fill="#2563eb"
          radius={[8,8,0,0]}
        />

      </BarChart>

    </ResponsiveContainer>

  </div>

  <div className="overview">

    <h2>Quick Overview</h2>

    <div className="overview-item">
      <span>📚 Total Courses</span>
      <strong>12</strong>
    </div>

    <div className="overview-item">
      <span>👨‍🏫 Faculty Members</span>
      <strong>18</strong>
    </div>

    <div className="overview-item">
      <span>📝 Today's Classes</span>
      <strong>24</strong>
    </div>

    <div className="overview-item">
      <span>📅 Attendance Rate</span>
      <strong>88%</strong>
    </div>

    <div className="overview-item">
      <span>🏆 Best Class</span>
      <strong>BCA-II</strong>
    </div>

  </div>

</div>

{/* TABLE */}

<div className="table-box">

<div className="table-header">

<h2>Recent Attendance</h2>

<button>View All</button>

</div>

<table>

<thead>

<tr>

<th>Roll No</th>
<th>Name</th>
<th>Class</th>
<th>Date</th>
<th>Status</th>

</tr>

</thead>

<tbody>

<tr>
<td>101</td>
<td>Rahul Sharma</td>
<td>BCA-I</td>
<td>08/07/2026</td>
<td><span className="present-text">Present</span></td>
</tr>

<tr>
<td>102</td>
<td>Priya Patil</td>
<td>BCA-II</td>
<td>08/07/2026</td>
<td><span className="absent-text">Absent</span></td>
</tr>

<tr>
<td>103</td>
<td>Amit Verma</td>
<td>BCA-III</td>
<td>08/07/2026</td>
<td><span className="present-text">Present</span></td>
</tr>

<tr>
<td>104</td>
<td>Sneha Gupta</td>
<td>BCA-II</td>
<td>08/07/2026</td>
<td><span className="present-text">Present</span></td>
</tr>

<tr>
<td>105</td>
<td>Rohit Patil</td>
<td>BCA-I</td>
<td>08/07/2026</td>
<td><span className="absent-text">Absent</span></td>
</tr>

</tbody>

</table>

</div>

</>
)}

{/* ================= OTHER PAGES ================= */}

{activePage === "students" && <Students />}

{activePage === "attendance" && <Attendance />}

{activePage === "reports" && <Reports />}

{activePage === "settings" && <Settings />}

</div>

</div>

);

}

export default Dashboard;