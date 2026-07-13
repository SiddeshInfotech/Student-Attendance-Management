import { useState, useEffect } from "react";
import "../styles/Attendance.css";

function Attendance() {

  const [search, setSearch] = useState("");

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("attendanceData");

    return saved
      ? JSON.parse(saved)
      : [
          { roll: 101, name: "Hemangi Suryawanshi", class: "BCA-I", status: "" },
          { roll: 102, name: "Rani Patil", class: "BCA-II", status: "" },
          { roll: 103, name: "Amit Verma", class: "BCA-III", status: "" },
          { roll: 104, name: "Sneha Patil", class: "BCA-I", status: "" },
          { roll: 105, name: "Rohit Patil", class: "BCA-II", status: "" }
        ];
  });

  useEffect(() => {
    localStorage.setItem("attendanceData", JSON.stringify(students));
  }, [students]);

  const handleAttendance = (roll, value) => {
    setStudents(
      students.map((student) =>
        student.roll === roll
          ? { ...student, status: value }
          : student
      )
    );
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="attendance-page">
      <div className="top-section">

  <div className="welcome-card">

    <div className="welcome-left">
      <h1>Student Attendance Management System</h1>
      <p>Welcome back, Admin 👋</p>
    </div>

    <div className="welcome-right">

      <input
        type="text"
        placeholder="Search students..."
        className="top-search"
      />

      <div className="bell-icon">
        🔔
        <span className="badge">3</span>
      </div>

      <div className="admin-profile">
        <div className="profile-icon">👤</div>
        <div>
          <h4>Admin</h4>
          <p>Administrator</p>
        </div>
      </div>

    </div>

  </div>

</div>

      <h1 className="main-title">
        Student Attendance Management System
      </h1>

      <input
        type="text"
        placeholder="Search Student Name"
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="attendance-header">

        <h2>Attendance Management</h2>

        <button
          onClick={() => alert("Attendance Saved Successfully")}
        >
          Save Attendance
        </button>

      </div>

      <table>

        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Class</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>
        </thead>

        <tbody>

          {filteredStudents.map((student) => (
            <tr key={student.roll}>

              <td>{student.roll}</td>

              <td>{student.name}</td>

              <td>{student.class}</td>

              <td>
                <input
                  type="radio"
                  name={student.roll}
                  checked={student.status === "Present"}
                  onChange={() =>
                    handleAttendance(student.roll, "Present")
                  }
                />
              </td>

              <td>
                <input
                  type="radio"
                  name={student.roll}
                  checked={student.status === "Absent"}
                  onChange={() =>
                    handleAttendance(student.roll, "Absent")
                  }
                />
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Attendance;
