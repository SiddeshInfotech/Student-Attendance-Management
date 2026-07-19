import { useState } from "react";
import { FaUserCircle, FaEdit, FaSave } from "react-icons/fa";
import "../styles/MyProfile.css";

const MyProfile = () => {
  const currentStudent = JSON.parse(
    localStorage.getItem("currentStudent")
  );

  const [isEdit, setIsEdit] = useState(false);

  const [student, setStudent] = useState({
    fullName: currentStudent?.fullName || "",
    rollNo: currentStudent?.rollNo || "",
    className: currentStudent?.className || "",
    email: currentStudent?.email || "",
    username: currentStudent?.username || "",
  });

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    let students =
      JSON.parse(localStorage.getItem("students")) || [];

    students = students.map((item) =>
      item.id === currentStudent.id
        ? {
            ...item,
            fullName: student.fullName,
            rollNo: student.rollNo,
            className: student.className,
            email: student.email,
            username: student.username,
          }
        : item
    );

    localStorage.setItem(
      "students",
      JSON.stringify(students)
    );

    localStorage.setItem(
      "currentStudent",
      JSON.stringify({
        ...currentStudent,
        ...student,
      })
    );

    alert("Profile Updated Successfully");

    setIsEdit(false);
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-image">
          <FaUserCircle />
        </div>

        <h1>My Profile</h1>

        <div className="profile-form">

          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            value={student.fullName}
            disabled={!isEdit}
            onChange={handleChange}
          />

          <label>Roll Number</label>

          <input
            type="text"
            name="rollNo"
            value={student.rollNo}
            disabled={!isEdit}
            onChange={handleChange}
          />

          <label>Class</label>

          <input
            type="text"
            name="className"
            value={student.className}
            disabled={!isEdit}
            onChange={handleChange}
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={student.email}
            disabled={!isEdit}
            onChange={handleChange}
          />

          <label>Username</label>

          <input
            type="text"
            name="username"
            value={student.username}
            disabled={!isEdit}
            onChange={handleChange}
          />

          {isEdit ? (
            <button
              className="save-btn"
              onClick={saveProfile}
            >
              <FaSave />
              Save Profile
            </button>
          ) : (
            <button
              className="edit-btn"
              onClick={() => setIsEdit(true)}
            >
              <FaEdit />
              Edit Profile
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default MyProfile;
