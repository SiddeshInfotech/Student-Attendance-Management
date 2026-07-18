import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaCalendarCheck,
  FaHistory,
  FaKey,
  FaSignOutAlt,
  FaUserGraduate,
} from "react-icons/fa";

import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("currentStudent");
    navigate("/");
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <FaUserGraduate className="logo-icon" />

        <h2>SAMS</h2>

      </div>

      <nav className="sidebar-menu">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "menu active" : "menu"
          }
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "menu active" : "menu"
          }
        >
          <FaUser />
          <span>My Profile</span>
        </NavLink>

        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            isActive ? "menu active" : "menu"
          }
        >
          <FaCalendarCheck />
          <span>My Attendance</span>
        </NavLink>

        <NavLink
          to="/attendance-history"
          className={({ isActive }) =>
            isActive ? "menu active" : "menu"
          }
        >
          <FaHistory />
          <span>Attendance History</span>
        </NavLink>

        <NavLink
          to="/change-password"
          className={({ isActive }) =>
            isActive ? "menu active" : "menu"
          }
        >
          <FaKey />
          <span>Change Password</span>
        </NavLink>

      </nav>

      <button
        className="logout-btn"
        onClick={logout}
      >
        <FaSignOutAlt />

        Logout

      </button>

    </aside>
  );
};

export default Sidebar;