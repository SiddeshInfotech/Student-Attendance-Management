import { Link } from "react-router-dom";
import {
  FaUser,
  FaCalendarCheck,
  FaHistory,
  FaKey,
  FaUserGraduate,
  FaBookOpen,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AttendancePercentageCard from "../components/AttendancePercentageCard";
import DownloadReportButton from "../components/DownloadReportButton";

import "../styles/Dashboard.css";

const Dashboard = () => {
  const student = JSON.parse(
    localStorage.getItem("currentStudent")
  );

  if (!student) {
    return (
      <div className="dashboard-container">
        <div className="login-message">
          <h2>Please Login First</h2>

          <Link to="/" className="back-login-btn">
            Back To Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="dashboard-body">

          {/* Welcome Card */}

          <div className="welcome-card">

            <div className="welcome-left">

              <h1>
                Welcome,
                <span> {student.fullName}</span>
              </h1>

              <p>
                Student Attendance Management System
              </p>

            </div>

            <div className="welcome-icon">
              <FaUserGraduate />
            </div>

          </div>

          {/* Student Information */}

          <div className="student-card">

            <div className="info-box">

              <FaUser className="info-icon" />

              <div>
                <h3>Student Name</h3>
                <p>{student.fullName}</p>
              </div>

            </div>

            <div className="info-box">

              <FaBookOpen className="info-icon" />

              <div>
                <h3>Roll Number</h3>
                <p>{student.rollNo}</p>
              </div>

            </div>

            <div className="info-box">

              <FaUserGraduate className="info-icon" />

              <div>
                <h3>Class</h3>
                <p>{student.className}</p>
              </div>

            </div>

          </div>

          {/* Attendance */}

          <AttendancePercentageCard />

          {/* Download */}

          <div className="download-section">
            <DownloadReportButton />
          </div>

          {/* Quick Actions */}

          <h2 className="section-title">
            Quick Actions
          </h2>

          <div className="quick-actions">

            <Link
              to="/profile"
              className="action-card"
            >
              <FaUser className="card-icon" />

              <h3>My Profile</h3>

              <p>
                View & Edit Profile
              </p>

            </Link>

            <Link
              to="/attendance"
              className="action-card"
            >
              <FaCalendarCheck className="card-icon" />

              <h3>My Attendance</h3>

              <p>
                View Attendance
              </p>

            </Link>

            <Link
              to="/attendance-history"
              className="action-card"
            >
              <FaHistory className="card-icon" />

              <h3>
                Attendance History
              </h3>

              <p>
                Previous Records
              </p>

            </Link>

            <Link
              to="/change-password"
              className="action-card"
            >
              <FaKey className="card-icon" />

              <h3>
                Change Password
              </h3>

              <p>
                Secure Your Account
              </p>

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;