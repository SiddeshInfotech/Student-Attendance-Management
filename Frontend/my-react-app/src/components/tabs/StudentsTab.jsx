/**
 * StudentsTab.jsx
 * ─────────────────────────────────────────────────────────
 * Student management tab:
 * - Student roster with advanced search (name, partial,
 *   roll no, class, division)
 * - Add student form with duplicate prevention
 * - Students are registered once — attendance is separate
 * ─────────────────────────────────────────────────────────
 */

import { useState, useMemo } from "react";
import {
  FaSearch, FaUserPlus, FaGraduationCap, FaUser,
  FaIdCard, FaPhone, FaUniversity, FaTrash,
  FaExclamationTriangle, FaCheck,
} from "react-icons/fa";

function StudentsTab({ store, triggerBanner }) {
  const { students, addStudent, deleteStudent, searchStudents } = store;

  // Form state
  const [newName,     setNewName]     = useState("");
  const [newRoll,     setNewRoll]     = useState("");
  const [newGrade,    setNewGrade]    = useState("Grade 1");
  const [newDivision, setNewDivision] = useState("A");
  const [newPhone,    setNewPhone]    = useState("");
  const [formError,   setFormError]   = useState("");

  // Search state
  const [searchQuery,  setSearchQuery]  = useState("");
  const [gradeFilter,  setGradeFilter]  = useState("All");

  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // ── Filtered students ─────────────────────────────────
  const filteredStudents = useMemo(() => {
    let result = searchQuery.trim()
      ? searchStudents(searchQuery)
      : students;

    if (gradeFilter !== "All") {
      result = result.filter((s) => s.grade === gradeFilter);
    }

    return [...result].sort((a, b) => a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true }));
  }, [students, searchQuery, gradeFilter, searchStudents]);

  const allGrades = useMemo(() => {
    return ["All", ...new Set(students.map((s) => s.grade))].sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b, undefined, { numeric: true });
    });
  }, [students]);

  // ── Stats ─────────────────────────────────────────────
  const totalEnrolled = students.length;
  const activeClasses = new Set(students.map((s) => s.grade)).size;
  const divisions     = new Set(students.map((s) => s.division)).size;

  // ── Handlers ─────────────────────────────────────────
  const handleAddStudent = (e) => {
    e.preventDefault();
    setFormError("");

    const err = addStudent({
      name: newName, rollNo: newRoll,
      grade: newGrade, division: newDivision, phone: newPhone,
    });

    if (err) {
      setFormError(err);
      return;
    }

    setNewName(""); setNewRoll(""); setNewPhone("");
    triggerBanner(`Student "${newName.trim()}" enrolled successfully!`);
  };

  const handleDeleteConfirm = (id) => {
    const student = students.find((s) => s.id === id);
    deleteStudent(id);
    setDeleteConfirmId(null);
    triggerBanner(`Student "${student?.name}" removed from system.`);
  };

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="content-header">
        <div className="header-welcome">
          <h2>Student Roster</h2>
          <p className="header-date">
            Manage student records — add each student only once
          </p>
        </div>
      </header>

      {/* ── Sub-KPI Cards ──────────────────────────────────── */}
      <section className="metrics-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))" }}>
        <div className="metric-card bg-glass" style={{ padding: "18px 20px" }}>
          <div className="metric-icon-wrap bg-blue" style={{ width: "46px", height: "46px" }}>
            <FaGraduationCap className="metric-icon" style={{ fontSize: "20px" }} />
          </div>
          <div className="metric-info">
            <h3 style={{ fontSize: "26px" }}>{totalEnrolled}</h3>
            <p style={{ fontSize: "13px" }}>Total Enrolled</p>
          </div>
        </div>
        <div className="metric-card bg-glass" style={{ padding: "18px 20px" }}>
          <div className="metric-icon-wrap bg-emerald" style={{ width: "46px", height: "46px" }}>
            <FaUniversity className="metric-icon" style={{ fontSize: "20px" }} />
          </div>
          <div className="metric-info">
            <h3 style={{ fontSize: "26px" }}>{activeClasses}</h3>
            <p style={{ fontSize: "13px" }}>Classes</p>
          </div>
        </div>
        <div className="metric-card bg-glass" style={{ padding: "18px 20px" }}>
          <div className="metric-icon-wrap bg-orange" style={{ width: "46px", height: "46px" }}>
            <FaGraduationCap className="metric-icon" style={{ fontSize: "20px" }} />
          </div>
          <div className="metric-info">
            <h3 style={{ fontSize: "26px" }}>{divisions}</h3>
            <p style={{ fontSize: "13px" }}>Divisions</p>
          </div>
        </div>
      </section>

      <div className="students-tab-grid">
        {/* ── Left: Student List ─────────────────────────── */}
        <div className="table-card bg-glass">
          <div className="table-card-header">
            <div className="table-title">
              <h3>Registered Students</h3>
              <p>Search by name, roll number, class, or division</p>
            </div>
            <div className="table-filters">
              {/* Search bar */}
              <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Grade filter */}
              <div className="filter-badge-row" style={{ flexWrap: "wrap" }}>
                {allGrades.map((grade) => (
                  <button
                    key={grade}
                    className={`filter-badge-btn ${gradeFilter === grade ? "active" : ""}`}
                    onClick={() => setGradeFilter(grade)}
                  >
                    {grade === "All" ? "All" : grade.replace("Grade ", "Gr.")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Division</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td><strong>{student.rollNo}</strong></td>
                      <td>
                        <div className="student-profile">
                          <div className="avatar-badge">
                            {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="student-name">{student.name}</span>
                        </div>
                      </td>
                      <td>{student.grade}</td>
                      <td>
                        <span className="division-badge">{student.division}</span>
                      </td>
                      <td>
                        {deleteConfirmId === student.id ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              className="table-action-btn"
                              style={{ borderColor: "#ef4444", color: "#ef4444" }}
                              onClick={() => handleDeleteConfirm(student.id)}
                            >
                              <FaCheck /> Confirm
                            </button>
                            <button
                              className="table-action-btn"
                              onClick={() => setDeleteConfirmId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="table-action-btn"
                            style={{ borderColor: "#ef4444", color: "#ef4444" }}
                            onClick={() => setDeleteConfirmId(student.id)}
                            title="Delete student"
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="table-empty-state">
                      {searchQuery
                        ? `No students match "${searchQuery}".`
                        : "No students registered yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredStudents.length > 0 && (
            <div style={{ padding: "12px 16px", fontSize: "13px", color: "#64748b", borderTop: "1px solid #f1f5f9" }}>
              Showing {filteredStudents.length} of {students.length} students
            </div>
          )}
        </div>

        {/* ── Right: Add Student Form ───────────────────── */}
        <div className="add-student-inline-card bg-glass">
          <div className="inline-card-header">
            <div
              className="brand-logo-icon"
              style={{ backgroundColor: "#eff6ff", color: "#3b82f6", width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <FaUserPlus style={{ fontSize: "18px" }} />
            </div>
            <div>
              <h3>Enroll New Student</h3>
              <p>Students are added once — attend daily via Attendance tab</p>
            </div>
          </div>

          {formError && (
            <div className="form-error-box">
              <FaExclamationTriangle className="form-error-icon" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleAddStudent} className="inline-form-form">
            <div className="modal-input-group">
              <label>Student Name *</label>
              <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1" }}>
                <FaUser className="input-icon" style={{ fontSize: "15px", left: "14px", color: "#64748b" }} />
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setFormError(""); }}
                  style={{ height: "46px", paddingLeft: "42px", fontSize: "15px" }}
                  required
                />
              </div>
            </div>

            <div className="modal-input-group">
              <label>Roll Number *</label>
              <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1" }}>
                <FaIdCard className="input-icon" style={{ fontSize: "15px", left: "14px", color: "#64748b" }} />
                <input
                  type="text"
                  placeholder="e.g. 101"
                  value={newRoll}
                  onChange={(e) => { setNewRoll(e.target.value); setFormError(""); }}
                  style={{ height: "46px", paddingLeft: "42px", fontSize: "15px" }}
                  required
                />
              </div>
            </div>

            <div className="modal-input-group">
              <label>Class / Grade *</label>
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                style={{ height: "46px", fontSize: "15px" }}
              >
                {Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="modal-input-group">
              <label>Division</label>
              <select
                value={newDivision}
                onChange={(e) => setNewDivision(e.target.value)}
                style={{ height: "46px", fontSize: "15px" }}
              >
                {["A", "B", "C", "D"].map((d) => (
                  <option key={d} value={d}>Division {d}</option>
                ))}
              </select>
            </div>

            <div className="modal-input-group">
              <label>Phone (optional)</label>
              <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1" }}>
                <FaPhone className="input-icon" style={{ fontSize: "14px", left: "14px", color: "#64748b" }} />
                <input
                  type="tel"
                  placeholder="Parent contact"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  style={{ height: "46px", paddingLeft: "42px", fontSize: "15px" }}
                />
              </div>
            </div>

            <button type="submit" className="primary-action-btn inline-submit-btn">
              <FaUserPlus />
              <span>Register Student</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default StudentsTab;
