import { FaUserCircle, FaCalendarAlt } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const currentStudent = JSON.parse(
    localStorage.getItem("currentStudent")
  );

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="navbar">

      <div className="navbar-left">

        <h2>
          Welcome,
          <span>
            {" "}
            {currentStudent?.fullName || "Student"}
          </span>
        </h2>

        <p>
          Student Attendance Management System
        </p>

      </div>

      <div className="navbar-right">

        <div className="date-box">

          <FaCalendarAlt />

          <span>{today}</span>

        </div>

        <div className="profile-box">

          <FaUserCircle className="profile-icon" />

          <div>

            <h4>
              {currentStudent?.fullName}
            </h4>

            <small>
              {currentStudent?.className}
            </small>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;