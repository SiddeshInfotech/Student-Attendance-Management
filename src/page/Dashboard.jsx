import { Link } from "react-router-dom";
import {
  FaUser,
  FaCalendarCheck,
  FaHistory,
  FaKey,
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
        <h2 style={{ padding: "40px" }}>
          Please Login First
        </h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <div className="dashboard-body">

          <div className="welcome-card">
            <h1>
              Welcome, {student.fullName}
            </h1>

            <p>
              Student Attendance Management System
            </p>
          </div>

          <div className="student-card">

            <div>
              <h3>Student Name</h3>
              <p>{student.fullName}</p>
            </div>

            <div>
              <h3>Roll Number</h3>
              <p>{student.rollNo}</p>
            </div>

            <div>
              <h3>Class</h3>
              <p>{student.className}</p>
            </div>

          </div>

          <AttendancePercentageCard />

          <DownloadReportButton />

          <div className="quick-actions">

            <Link
              to="/profile"
              className="action-card"
            >
              <FaUser className="card-icon" />
              <h3>My Profile</h3>
            </Link>

            <Link
              to="/attendance"
              className="action-card"
            >
              <FaCalendarCheck className="card-icon" />
              <h3>My Attendance</h3>
            </Link>

            <Link
              to="/attendance-history"
              className="action-card"
            >
              <FaHistory className="card-icon" />
              <h3>Attendance History</h3>
            </Link>

            <Link
              to="/change-password"
              className="action-card"
            >
              <FaKey className="card-icon" />
              <h3>Change Password</h3>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;