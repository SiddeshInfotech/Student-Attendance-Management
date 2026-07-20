import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaKey } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/ChangePassword.css";

const ChangePassword = () => {
  const navigate = useNavigate();

  const currentStudent = JSON.parse(
    localStorage.getItem("currentStudent")
  );

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentStudent) {
      alert("Please Login First");
      navigate("/");
      return;
    }

    if (passwords.oldPassword !== currentStudent.password) {
      alert("Old Password is incorrect");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New Passwords do not match");
      return;
    }

    let students =
      JSON.parse(localStorage.getItem("students")) || [];

    const updatedStudents = students.map((student) => {
      if (student.id === currentStudent.id) {
        return {
          ...student,
          password: passwords.newPassword,
        };
      }
      return student;
    });

    localStorage.setItem(
      "students",
      JSON.stringify(updatedStudents)
    );

    const updatedCurrentStudent = {
      ...currentStudent,
      password: passwords.newPassword,
    };

    localStorage.setItem(
      "currentStudent",
      JSON.stringify(updatedCurrentStudent)
    );

    alert("Password Updated Successfully");

    navigate("/dashboard");
  };

  return (
    <div className="dashboard-container">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <div className="change-page">

          <div className="change-card">

            <div className="change-icon">
              <FaKey />
            </div>

            <h3>Change Password</h3>

            <form onSubmit={handleSubmit}>

              <div className="password-box">
                <FaLock />

                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Old Password"
                  value={passwords.oldPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="password-box">
                <FaLock />

                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="password-box">
                <FaLock />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="change-btn"
              >
                Update Password
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ChangePassword;