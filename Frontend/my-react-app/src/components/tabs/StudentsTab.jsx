/**
 * StudentsTab.jsx
 * ─────────────────────────────────────────────────────────
 * Student management tab:
 * - Student roster with advanced search (name, partial,
 *   roll no, class, division)
 * - Add student form with duplicate prevention
 * - Edit student inline modal
 * - Students are registered once — attendance is separate
 * ─────────────────────────────────────────────────────────
 */

import { useState, useMemo, useRef, useEffect } from "react";
import {
  FaSearch, FaUserPlus, FaGraduationCap, FaUser,
  FaIdCard, FaPhone, FaUniversity, FaTrash,
  FaExclamationTriangle, FaCheck, FaEdit, FaTimes, FaSave,
  FaEnvelope, FaLock, FaEye, FaEyeSlash,
} from "react-icons/fa";

function StudentsTab({ store, triggerBanner, scrollToEnroll, onScrollHandled }) {
  const { students, addStudent, deleteStudent, updateStudent, searchStudents } = store;

  // ── Ref for scroll-to-enroll ─────────────────────────────
  const enrollFormRef = useRef(null);

  useEffect(() => {
    if (scrollToEnroll && enrollFormRef.current) {
      enrollFormRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      // Briefly highlight the form
      enrollFormRef.current.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.4)";
      setTimeout(() => {
        if (enrollFormRef.current) enrollFormRef.current.style.boxShadow = "";
      }, 2000);
      if (onScrollHandled) onScrollHandled();
    }
  }, [scrollToEnroll, onScrollHandled]);

  // ── Add-form state ──────────────────────────────────────
  const [newName,        setNewName]        = useState("");
  const [newRoll,        setNewRoll]        = useState("");
  const [newGrade,       setNewGrade]       = useState("Grade 1");
  const [newDivision,    setNewDivision]    = useState("A");
  const [newPhone,       setNewPhone]       = useState("");
  const [newEmail,       setNewEmail]       = useState("");
  const [newPassword,    setNewPassword]    = useState("");
  const [newConfirmPwd,  setNewConfirmPwd]  = useState("");
  const [showNewPwd,     setShowNewPwd]     = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [formError,      setFormError]      = useState("");
  const [formLoading,    setFormLoading]    = useState(false);

  // ── Search / filter state ───────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");

  // ── Delete confirm ──────────────────────────────────────
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // ── Edit modal state ────────────────────────────────────
  const [editStudent,  setEditStudent]  = useState(null); // the student being edited
  const [editName,     setEditName]     = useState("");
  const [editRoll,     setEditRoll]     = useState("");
  const [editGrade,    setEditGrade]    = useState("");
  const [editDivision, setEditDivision] = useState("");
  const [editPhone,    setEditPhone]    = useState("");
  const [editEmail,    setEditEmail]    = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPwd,  setShowEditPwd]  = useState(false);
  const [editError,    setEditError]    = useState("");
  const [editSaving,   setEditSaving]   = useState(false);

  // ── Filtered students ───────────────────────────────────
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

  // ── Stats ───────────────────────────────────────────────
  const totalEnrolled = students.length;
  const activeClasses = new Set(students.map((s) => s.grade)).size;
  const divisions = new Set(students.map((s) => s.division)).size;

  // ── Add handler ─────────────────────────────────────────
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate email & password
    if (!newEmail.trim()) { setFormError("Email address is required."); return; }
    if (!newPassword.trim()) { setFormError("Password is required."); return; }
    if (newPassword.length < 6) { setFormError("Password must be at least 6 characters."); return; }
    if (newPassword !== newConfirmPwd) { setFormError("Passwords do not match."); return; }

    setFormLoading(true);
    const savedName = newName.trim();
    try {
      const err = await addStudent({
        name: newName, rollNo: newRoll,
        grade: newGrade, division: newDivision, phone: newPhone,
        email: newEmail.trim(), password: newPassword.trim(),
      });

      if (err) { setFormError(err); return; }

      setNewName(""); setNewRoll(""); setNewPhone("");
      setNewEmail(""); setNewPassword(""); setNewConfirmPwd("");
      triggerBanner(`Student "${savedName}" enrolled successfully!`);
    } catch (err) {
      setFormError(err?.message || "Failed to register student. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete handler ──────────────────────────────────────
  const handleDeleteConfirm = (id) => {
    const student = students.find((s) => s.id === id);
    deleteStudent(id);
    setDeleteConfirmId(null);
    triggerBanner(`Student "${student?.name}" removed from system.`);
  };

  // ── Edit handlers ────────────────────────────────────────
  const openEdit = (student) => {
    setEditStudent(student);
    setEditName(student.name);
    setEditRoll(student.rollNo);
    setEditGrade(student.grade || "Grade 1");
    setEditDivision(student.division || "A");
    setEditPhone(student.phone || "");
    setEditEmail(student.email || "");
    setEditPassword("");
    setShowEditPwd(false);
    setEditError("");
    setDeleteConfirmId(null); // close any pending delete
  };

  const closeEdit = () => {
    setEditStudent(null);
    setEditError("");
    setEditSaving(false);
  };

  const handleEditSave = async () => {
    setEditError("");
    if (!editName.trim()) { setEditError("Name is required."); return; }
    if (!editRoll.trim()) { setEditError("Roll number is required."); return; }
    if (editPassword && editPassword.trim().length < 6) {
      setEditError("New password must be at least 6 characters.");
      return;
    }

    // Check duplicate roll (excluding current student)
    const duplicate = students.find(
      (s) => s.rollNo === editRoll.trim() && s.id !== editStudent.id
    );
    if (duplicate) { setEditError(`Roll No "${editRoll}" is already taken by ${duplicate.name}.`); return; }

    setEditSaving(true);
    try {
      const updates = {
        name: editName.trim(),
        rollNo: editRoll.trim(),
        grade: editGrade,
        division: editDivision,
        phone: editPhone.trim(),
        email: editEmail.trim(),
      };
      if (editPassword.trim()) {
        updates.password = editPassword.trim();
      }

      await updateStudent(editStudent.id, updates);
      triggerBanner(`Student "${editName.trim()}" updated successfully!`);
      closeEdit();
    } catch {
      setEditError("Failed to save. Please try again.");
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <>
      {/* ── Edit Modal Overlay ──────────────────────────── */}
      {editStudent && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div
            style={{
              background: "#fff", borderRadius: "18px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
              width: "100%", maxWidth: "480px",
              padding: "32px", position: "relative",
              animation: "slideDownIn 0.25s ease both",
              maxHeight: "90vh", overflowY: "auto",
            }}
          >
            {/* Close */}
            <button
              onClick={closeEdit}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "#f1f5f9", border: "none", borderRadius: "8px",
                width: "32px", height: "32px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#64748b", fontSize: "14px",
              }}
            >
              <FaTimes />
            </button>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
              <div
                style={{
                  width: "46px", height: "46px", borderRadius: "12px",
                  background: "#eff6ff", color: "#3b82f6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", flexShrink: 0,
                }}
              >
                <FaEdit />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>Edit Student</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Update student information</p>
              </div>
            </div>

            {/* Error */}
            {editError && (
              <div className="form-error-box" style={{ marginBottom: "16px" }}>
                <FaExclamationTriangle className="form-error-icon" />
                <span>{editError}</span>
              </div>
            )}

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Name */}
              <div className="modal-input-group">
                <label>Student Name *</label>
                <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1" }}>
                  <FaUser className="input-icon" style={{ fontSize: "15px", left: "14px", color: "#64748b" }} />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={editName}
                    onChange={(e) => { setEditName(e.target.value); setEditError(""); }}
                    style={{ height: "46px", paddingLeft: "42px", fontSize: "15px" }}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="modal-input-group">
                <label>Email Address</label>
                <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1" }}>
                  <FaEnvelope className="input-icon" style={{ fontSize: "14px", left: "14px", color: "#64748b" }} />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={editEmail}
                    onChange={(e) => { setEditEmail(e.target.value); setEditError(""); }}
                    style={{ height: "46px", paddingLeft: "42px", fontSize: "15px" }}
                  />
                </div>
              </div>

              {/* Roll No */}
              <div className="modal-input-group">
                <label>Roll Number *</label>
                <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1" }}>
                  <FaIdCard className="input-icon" style={{ fontSize: "15px", left: "14px", color: "#64748b" }} />
                  <input
                    type="text"
                    placeholder="e.g. 7"
                    value={editRoll}
                    onChange={(e) => { setEditRoll(e.target.value); setEditError(""); }}
                    style={{ height: "46px", paddingLeft: "42px", fontSize: "15px" }}
                  />
                </div>
              </div>

              {/* Grade & Division row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="modal-input-group">
                  <label>Class / Grade *</label>
                  <select
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
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
                    value={editDivision}
                    onChange={(e) => setEditDivision(e.target.value)}
                    style={{ height: "46px", fontSize: "15px" }}
                  >
                    {["A", "B", "C", "D"].map((d) => (
                      <option key={d} value={d}>Division {d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div className="modal-input-group">
                <label>Phone (optional)</label>
                <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1" }}>
                  <FaPhone className="input-icon" style={{ fontSize: "14px", left: "14px", color: "#64748b" }} />
                  <input
                    type="tel"
                    placeholder="Parent contact"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    style={{ height: "46px", paddingLeft: "42px", fontSize: "15px" }}
                  />
                </div>
              </div>

              {/* New Password (Optional) */}
              <div className="modal-input-group">
                <label>New Password (leave blank to keep current)</label>
                <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1", position: "relative" }}>
                  <FaLock className="input-icon" style={{ fontSize: "14px", left: "14px", color: "#64748b" }} />
                  <input
                    type={showEditPwd ? "text" : "password"}
                    placeholder="Enter new password (optional)"
                    value={editPassword}
                    onChange={(e) => { setEditPassword(e.target.value); setEditError(""); }}
                    style={{ height: "46px", paddingLeft: "42px", paddingRight: "44px", fontSize: "15px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPwd(!showEditPwd)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "15px", display: "flex", alignItems: "center" }}
                  >
                    {showEditPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button
                onClick={handleEditSave}
                disabled={editSaving}
                className="primary-action-btn inline-submit-btn"
                style={{ flex: 1, background: "#3b82f6", boxShadow: "0 4px 14px rgba(59,130,246,0.25)" }}
              >
                {editSaving
                  ? <div className="loading-spinner" style={{ width: "15px", height: "15px", borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} />
                  : <FaSave />
                }
                <span>{editSaving ? "Saving..." : "Save Changes"}</span>
              </button>
              <button
                onClick={closeEdit}
                style={{
                  padding: "0 20px", height: "46px", borderRadius: "10px",
                  border: "1.5px solid #e2e8f0", background: "#f8fafc",
                  cursor: "pointer", fontWeight: 600, color: "#64748b",
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* ── Registered Students Table (Full Width) ──────── */}
      <div className="table-card bg-glass">
        <div className="table-card-header">
          <div className="table-title">
            <h3>Registered Students</h3>
            <p>Search by name, roll number, class, or division</p>
          </div>
          <div className="table-filters">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
          <table className="student-table" style={{ tableLayout: "fixed", width: "100%" }}>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "28%" }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Roll No</th>
                <th>Student Name</th>
                <th>Class</th>
                <th style={{ textAlign: "center" }}>Division</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td style={{ textAlign: "center" }}><strong>{student.rollNo}</strong></td>
                    <td>
                      <div className="student-profile">
                        <div className="avatar-badge">
                          {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="student-name">{student.name}</span>
                      </div>
                    </td>
                    <td>{student.grade}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className="division-badge">{student.division}</span>
                    </td>
                    <td>
                      {deleteConfirmId === student.id ? (
                        /* ── Delete confirmation row ── */
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
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
                        /* ── Normal action buttons ── */
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          {/* Edit */}
                          <button
                            className="table-action-btn"
                            style={{ borderColor: "#3b82f6", color: "#3b82f6" }}
                            onClick={() => openEdit(student)}
                            title="Edit student"
                          >
                            <FaEdit />
                            <span>Edit</span>
                          </button>
                          {/* Delete */}
                          <button
                            className="table-action-btn"
                            style={{ borderColor: "#ef4444", color: "#ef4444" }}
                            onClick={() => setDeleteConfirmId(student.id)}
                            title="Delete student"
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        </div>
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

      {/* ── Enroll New Student Form (Below Table) ───────── */}
      <div ref={enrollFormRef} className="add-student-inline-card bg-glass" style={{ marginTop: "1.5rem", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
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
          {/* 1. Student Name */}
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

          {/* 2. Email Address */}
          <div className="modal-input-group">
            <label>Email Address *</label>
            <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1" }}>
              <FaEnvelope className="input-icon" style={{ fontSize: "14px", left: "14px", color: "#64748b" }} />
              <input
                type="email"
                placeholder="student@example.com"
                value={newEmail}
                onChange={(e) => { setNewEmail(e.target.value); setFormError(""); }}
                style={{ height: "46px", paddingLeft: "42px", fontSize: "15px" }}
                required
              />
            </div>
          </div>

          {/* 3. Phone Number */}
          <div className="modal-input-group">
            <label>Phone Number (optional)</label>
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

          {/* 4. Roll Number */}
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

          {/* 5. Class / Grade */}
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

          {/* 6. Division */}
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

          {/* 7. Create Password */}
          <div className="modal-input-group">
            <label>Create Password *</label>
            <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1", position: "relative" }}>
              <FaLock className="input-icon" style={{ fontSize: "14px", left: "14px", color: "#64748b" }} />
              <input
                type={showNewPwd ? "text" : "password"}
                placeholder="Create password (min 6 chars)"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setFormError(""); }}
                style={{ height: "46px", paddingLeft: "42px", paddingRight: "44px", fontSize: "15px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPwd(!showNewPwd)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "15px", display: "flex", alignItems: "center" }}
              >
                {showNewPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* 8. Confirm Password */}
          <div className="modal-input-group">
            <label>Confirm Password *</label>
            <div className="input-field-wrapper" style={{ border: "1.5px solid #cbd5e1", position: "relative" }}>
              <FaLock className="input-icon" style={{ fontSize: "14px", left: "14px", color: "#64748b" }} />
              <input
                type={showConfirmPwd ? "text" : "password"}
                placeholder="Repeat password"
                value={newConfirmPwd}
                onChange={(e) => { setNewConfirmPwd(e.target.value); setFormError(""); }}
                style={{ height: "46px", paddingLeft: "42px", paddingRight: "44px", fontSize: "15px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "15px", display: "flex", alignItems: "center" }}
              >
                {showConfirmPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="primary-action-btn inline-submit-btn"
            style={{ marginTop: "4px" }}
            disabled={formLoading}
          >
            {formLoading
              ? <div className="loading-spinner" style={{ width: "15px", height: "15px", borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} />
              : <FaUserPlus />
            }
            <span>{formLoading ? "Registering..." : "Register Student"}</span>
          </button>
        </form>
      </div>
    </>
  );
}

export default StudentsTab;
