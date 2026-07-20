import { useState } from "react";
import { FaHistory, FaSearch } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/AttendanceHistory.css";

const AttendanceHistory = () => {
  const student = JSON.parse(
    localStorage.getItem("currentStudent")
  );

  const attendance = student?.attendance || [];

  const [search, setSearch] = useState("");

  const filteredRecords = attendance.filter((item) => {
    return (
      item.date.includes(search) ||
      item.subject
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <div className="history-page">

          <div className="history-header">

            <FaHistory className="history-icon" />

            <h1>Attendance History</h1>

          </div>

          <div className="history-search">

            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search by Date or Subject"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="history-table">

            <table>

              <thead>

                <tr>
                  <th>No.</th>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {filteredRecords.length > 0 ? (

                  filteredRecords.map((record, index) => (

                    <tr key={index}>

                      <td>{index + 1}</td>

                      <td>{record.date}</td>

                      <td>{record.subject}</td>

                      <td>

                        <span
                          className={
                            record.status === "Present"
                              ? "history-present"
                              : "history-absent"
                          }
                        >
                          {record.status}
                        </span>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td colSpan="4">
                      No Records Found
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

export default AttendanceHistory;