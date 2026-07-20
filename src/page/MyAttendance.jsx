import { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBook,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/MyAttendance.css";

const MyAttendance = () => {
  const student = JSON.parse(
    localStorage.getItem("currentStudent")
  );

  const attendance = student?.attendance || [];

  const [searchDate, setSearchDate] = useState("");

  const filteredAttendance = attendance.filter((item) =>
    item.date.includes(searchDate)
  );

  const totalClasses = attendance.length;

  const presentDays = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentDays = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <div className="attendance-page">

          <h1>My Attendance</h1>

          <div className="attendance-summary">

            <div className="summary-card">
              <FaBook />
              <h3>Total Classes</h3>
              <p>{totalClasses}</p>
            </div>

            <div className="summary-card present">
              <FaCheckCircle />
              <h3>Present</h3>
              <p>{presentDays}</p>
            </div>

            <div className="summary-card absent">
              <FaTimesCircle />
              <h3>Absent</h3>
              <p>{absentDays}</p>
            </div>

          </div>

          <div className="search-box">
            <input
              type="date"
              value={searchDate}
              onChange={(e) =>
                setSearchDate(e.target.value)
              }
            />
          </div>

          <div className="attendance-table">

            <table>

              <thead>

                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((item, index) => (
                    <tr key={index}>

                      <td>{item.date}</td>

                      <td>{item.subject}</td>

                      <td>
                        <span
                          className={
                            item.status === "Present"
                              ? "present-status"
                              : "absent-status"
                          }
                        >
                          {item.status}
                        </span>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">
                      No Attendance Found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default MyAttendance;