import "../styles/Signup.css";
import {
  FaUserGraduate,
  FaUser,
  FaEnvelope,
  FaLock
} from "react-icons/fa";

function Signup({ goToLogin }) {
  return (
    <div className="signup-container">

      {/* Left Panel */}

      <div className="left-panel">

        <div className="overlay">

          <div className="brand">

            <FaUserGraduate className="brand-icon" />

            <h1>Student Attendance</h1>

            <h2>Management System</h2>

            <p>
              Create your administrator account and securely manage students,
              attendance records and reports from one powerful dashboard.
            </p>

          </div>

        </div>

      </div>

      {/* Right Panel */}

      <div className="right-panel">

        <div className="signup-card">

          <h3>Create Account</h3>

          <span>Admin Signup</span>

          <div className="input-group">
            <FaUser />
            <input
              type="text"
              placeholder="Full Name"
            />
          </div>

          <div className="input-group">
            <FaEnvelope />
            <input
              type="email"
              placeholder="Email Address"
            />
          </div>

          <div className="input-group">
            <FaLock />
            <input
              type="password"
              placeholder="Password"
            />
          </div>

          <div className="input-group">
            <FaLock />
            <input
              type="password"
              placeholder="Confirm Password"
            />
          </div>

          <button className="signup-btn">
            Sign Up
          </button>

          <p className="bottom-text">
            Already have an account?

            <a
              href="#"
              onClick={(e)=>{
                e.preventDefault();
                goToLogin();
              }}
            >
              Login
            </a>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;