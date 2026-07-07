import { useState } from "react";
import "../styles/Dashboard.css";

import Students from "./Students";
import Attendance from "./Attendance";
import Reports from "./Reports";
import Settings from "./Settings";

function Dashboard({
  logout,
  goToStudents,
  goToAttendance,
  goToReports,
  goToSettings,
}) {
  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">

        <div className="logo">
          🎓 <span>SAMS</span>
        </div>

        <ul>
          <li className="active">🏠 Dashboard</li>

          <li onClick={goToStudents}>
            👨‍🎓 Students
          </li>

          <li onClick={goToAttendance}>
            📅 Attendance
          </li>

          <li onClick={goToReports}>
            📊 Reports
          </li>

          <li onClick={goToSettings}>
            ⚙️ Settings
          </li>

          <li className="logout" onClick={logout}>
            🚪 Logout
          </li>

        </ul>

      </div>

      {/* Main */}

      <div className="main">

        {/* Navbar */}

        <div className="navbar">

          <div>
            <h2>Student Attendance Management System</h2>
            <p>Welcome Back, Admin 👋</p>
          </div>

          <div className="nav-right">

            <input
              type="text"
              placeholder="Search..."
            />

            <span className="icon">🔔</span>

            <div className="profile">

              <div className="avatar">
                👤
              </div>

              <div>
                <h4>Admin</h4>
                <small>Administrator</small>
              </div>

            </div>

          </div>

        </div>

        {/* Cards */}

        <div className="cards">

          <div className="card students">

            <div className="card-icon">
              👨‍🎓
            </div>

            <h3>Total Students</h3>

            <h1>250</h1>

            <p>+10 New Students</p>

          </div>

          <div className="card present">

            <div className="card-icon">
              ✅
            </div>

            <h3>Present Today</h3>

            <h1>220</h1>

            <p>88% Attendance</p>

          </div>

          <div className="card absent">

            <div className="card-icon">
              ❌
            </div>

            <h3>Absent Today</h3>

            <h1>30</h1>

            <p>12% Absent</p>

          </div>

          <div className="card teachers">

            <div className="card-icon">
              👨‍🏫
            </div>

            <h3>Total Teachers</h3>

            <h1>18</h1>

            <p>Active Faculty</p>

          </div>

        </div>

        {/* Table */}

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

                <td>06/07/2026</td>

                <td>
                  <span className="present-text">
                    Present
                  </span>
                </td>

              </tr>

              <tr>

                <td>102</td>

                <td>Priya Patil</td>

                <td>BCA-II</td>

                <td>06/07/2026</td>

                <td>
                  <span className="absent-text">
                    Absent
                  </span>
                </td>

              </tr>

              <tr>

                <td>103</td>

                <td>Amit Verma</td>

                <td>BCA-III</td>

                <td>06/07/2026</td>

                <td>
                  <span className="present-text">
                    Present
                  </span>
                </td>

              </tr>

              <tr>

                <td>104</td>

                <td>Sneha Gupta</td>

                <td>BCA-II</td>

                <td>06/07/2026</td>

                <td>
                  <span className="present-text">
                    Present
                  </span>
                </td>

              </tr>

              <tr>

                <td>105</td>

                <td>Rohit Patil</td>

                <td>BCA-I</td>

                <td>06/07/2026</td>

                <td>
                  <span className="absent-text">
                    Absent
                  </span>
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;