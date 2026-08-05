/**
 * AttendanceTab.jsx
 * ─────────────────────────────────────────────────────────
 * Daily attendance marking tab.
 * - Date picker (defaults to today)
 * - Lists all registered students with Present/Absent toggles
 * - Shows existing attendance if already saved for date
 * - Warns before overwriting existing records
 * - Save button persists to localStorage via store
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect, useMemo } from "react";
import {
  FaCalendarAlt, FaCheck, FaUserCheck, FaUserTimes,
  FaSave, FaExclamationTriangle, FaSearch,
} from "react-icons/fa";
import { todayStr, formatDateFull } from "../../store/useAttendanceStore";
import DatePicker from "../ui/DatePicker";

function AttendanceTab({ store, triggerBanner }) {
  const { students, getAttendanceForDate, isAttendanceSaved, saveAttendanceForDate } = store;

  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [statusMap, setStatusMap]       = useState({});
  const [editMode, setEditMode]         = useState(false);
  const [saving, setSaving]             = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");

  // Load existing attendance whenever date changes
  const dateRecords = useMemo(
    () => getAttendanceForDate(selectedDate),
    [selectedDate, getAttendanceForDate]
  );

  const alreadySaved = useMemo(
    () => isAttendanceSaved(selectedDate),
    [selectedDate, isAttendanceSaved]
  );

  // Initialise statusMap from existing records
  useEffect(() => {
    const map = {};
    dateRecords.forEach(({ student, record }) => {
      map[student.id] = record ? record.status : "Present"; // default = Present
    });
    setStatusMap(map);
    setEditMode(false); // Reset edit mode when date changes
  }, [selectedDate, dateRecords.length]);

  // ── Helpers ─────────────────────────────────────────────
  const toggleStatus = (studentId) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "Present" ? "Absent" : "Present",
    }));
  };

  const markAll = (status) => {
    const map = {};
    students.forEach((s) => { map[s.id] = status; });
    setStatusMap(map);
  };

  const presentCount = Object.values(statusMap).filter((s) => s === "Present").length;
  const absentCount  = Object.values(statusMap).filter((s) => s === "Absent").length;
  const totalCount   = students.length;

  const handleSave = async () => {
    if (students.length === 0) {
      triggerBanner("No students registered. Add students first.");
      return;
    }
    setSaving(true);
    try {
      const err = await saveAttendanceForDate(selectedDate, statusMap, editMode || !alreadySaved);
      setSaving(false);
      if (err) {
        triggerBanner(err, "error");
      } else {
        setEditMode(false);
        triggerBanner(`Attendance for ${formatDateFull(selectedDate)} saved successfully!`);
      }
    } catch (e) {
      setSaving(false);
      triggerBanner("Failed to save attendance. Please try again.", "error");
    }
  };

  // Filtered students for display
  const visibleStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  const canEdit = alreadySaved && !editMode;

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="content-header">
        <div className="header-welcome">
          <h2>Daily Attendance</h2>
          <p className="header-date">Mark Present / Absent for each registered student</p>
        </div>
      </header>

      {/* ── Date Picker Card ──────────────────────────────── */}
      <div className="bg-glass attendance-date-card">
        <div className="attendance-date-row">
          <div className="modal-input-group" style={{ flex: "1 1 200px", maxWidth: "320px" }}>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>
              <FaCalendarAlt style={{ marginRight: "6px", color: "#3b82f6" }} />
              Select Date
            </label>
            <DatePicker
              value={selectedDate}
              max={todayStr()}
              onChange={(dateStr) => setSelectedDate(dateStr)}
              style={{
                height: "46px", padding: "0 14px",
                border: "1.5px solid #cbd5e1", borderRadius: "10px",
                fontSize: "15px", color: "#0f172a", outline: "none",
                fontFamily: "Inter, sans-serif", background: "#fff",
              }}
              placeholder="Select Date"
            />
          </div>

          <div className="attendance-quick-stats">
            <div className="att-stat-pill att-present">{presentCount} Present</div>
            <div className="att-stat-pill att-absent">{absentCount} Absent</div>
            <div className="att-stat-pill att-total">{totalCount} Total</div>
          </div>
        </div>

        {/* Status bar */}
        {totalCount > 0 && (
          <div className="att-progress-bar-wrap">
            <div
              className="att-progress-bar-fill"
              style={{ width: `${totalCount > 0 ? (presentCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        )}

        {/* Already saved notice */}
        {alreadySaved && !editMode && (
          <div className="att-saved-notice">
            <FaCheck className="att-saved-icon" />
            <span>Attendance already saved for this date.</span>
            <button
              className="table-action-btn"
              style={{ marginLeft: "auto", borderColor: "#f97316", color: "#f97316" }}
              onClick={() => setEditMode(true)}
            >
              Edit Attendance
            </button>
          </div>
        )}
        {editMode && (
          <div className="att-edit-notice">
            <FaExclamationTriangle style={{ color: "#f59e0b", flexShrink: 0 }} />
            <span>Edit mode: changes will overwrite existing records for this date.</span>
          </div>
        )}
      </div>

      {/* ── Attendance Table ──────────────────────────────── */}
      <div className="table-card bg-glass">
        <div className="table-card-header">
          <div className="table-title">
            <h3>
              {formatDateFull(selectedDate)}
            </h3>
            <p>Click the status button to toggle Present ↔ Absent</p>
          </div>

          <div className="table-filters">
            {/* Search */}
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Bulk actions */}
            {!canEdit && (
              <div className="filter-badge-row">
                <button
                  className="filter-badge-btn"
                  style={{ borderColor: "#10b981", color: "#10b981" }}
                  onClick={() => markAll("Present")}
                >
                  All Present
                </button>
                <button
                  className="filter-badge-btn"
                  style={{ borderColor: "#ef4444", color: "#ef4444" }}
                  onClick={() => markAll("Absent")}
                >
                  All Absent
                </button>
              </div>
            )}
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="table-empty-state">
                    No students registered. Go to Students tab to add students.
                  </td>
                </tr>
              ) : visibleStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="table-empty-state">
                    No students match "{searchQuery}".
                  </td>
                </tr>
              ) : (
                visibleStudents.map((student) => {
                  const status = statusMap[student.id] || "Present";
                  const isPresent = status === "Present";

                  return (
                    <tr key={student.id} className={`att-row ${isPresent ? "att-row-present" : "att-row-absent"}`}>
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
                      <td><span className="division-badge">{student.division}</span></td>
                      <td>
                        <button
                          className={`att-toggle-btn ${isPresent ? "att-toggle-present" : "att-toggle-absent"}`}
                          onClick={() => !canEdit && toggleStatus(student.id)}
                          disabled={canEdit}
                          title={canEdit ? "Click Edit Attendance to modify" : "Click to toggle"}
                        >
                          {isPresent ? (
                            <><FaUserCheck /> Present</>
                          ) : (
                            <><FaUserTimes /> Absent</>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Save Button */}
        {students.length > 0 && !canEdit && (
          <div className="att-save-footer">
            <div style={{ fontSize: "14px", color: "#64748b" }}>
              {presentCount} present · {absentCount} absent out of {totalCount} students
            </div>
            <button
              className="primary-action-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <div className="loading-spinner" style={{ width: "16px", height: "16px", borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} />
              ) : (
                <FaSave />
              )}
              <span>{saving ? "Saving..." : alreadySaved ? "Update Attendance" : "Save Attendance"}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default AttendanceTab;
