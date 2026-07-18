import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    let students =
      JSON.parse(localStorage.getItem("students")) || [];

    const index = students.findIndex(
      (student) =>
        student.username === formData.usernameOrEmail ||
        student.email === formData.usernameOrEmail
    );

    if (index === -1) {
      alert("Student not found!");
      return;
    }

    students[index].password = formData.password;

    localStorage.setItem(
      "students",
      JSON.stringify(students)
    );

    alert("Password Updated Successfully");

    navigate("/");
  };

  return (
    <div className="forgot-page">

      <div className="forgot-card">

        <h1>Forgot Password</h1>

        <form onSubmit={handleReset}>

          <div className="input-box">

            <FaEnvelope className="icon"/>

            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-box">

            <FaLock className="icon"/>

            <input
              type="password"
              name="password"
              placeholder="New Password"
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-box">

            <FaLock className="icon"/>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />

          </div>

          <button className="reset-btn">
            Reset Password
          </button>

          <div className="back-login">

            <Link to="/">
              Back To Login
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ForgotPassword;