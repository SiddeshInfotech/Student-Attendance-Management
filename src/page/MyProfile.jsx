import { useState } from "react";
import "../styles/MyProfile.css";

const MyProfile = () => {
  const currentStudent = JSON.parse(
    localStorage.getItem("currentStudent")
  );

  const [editMode, setEditMode] = useState(false);

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

    const updatedStudents = students.map((item) =>
      item.id === currentStudent.id
        ? { ...item, ...student }
        : item
    );

    localStorage.setItem(
      "students",
      JSON.stringify(updatedStudents)
    );

    localStorage.setItem(
      "currentStudent",
      JSON.stringify({
        ...currentStudent,
        ...student,
      })
    );

    alert("Profile Updated Successfully");

    setEditMode(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        <h1>My Profile</h1>

        <div className="profile-form">

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={student.fullName}
            disabled={!editMode}
            onChange={handleChange}
          />

          <label>Roll Number</label>
          <input
            type="text"
            name="rollNo"
            value={student.rollNo}
            disabled={!editMode}
            onChange={handleChange}
          />

          <label>Class</label>
          <input
            type="text"
            name="className"
            value={student.className}
            disabled={!editMode}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={student.email}
            disabled={!editMode}
            onChange={handleChange}
          />

          <label>Username</label>
          <input
            type="text"
            name="username"
            value={student.username}
            disabled={!editMode}
            onChange={handleChange}
          />

          {!editMode ? (
            <button
              className="edit-btn"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <button
              className="save-btn"
              onClick={saveProfile}
            >
              Save Profile
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default MyProfile;
