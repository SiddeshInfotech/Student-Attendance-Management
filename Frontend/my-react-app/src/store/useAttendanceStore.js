/**
 * useAttendanceStore.js
 * ─────────────────────────────────────────────────────────
 * Central data layer using localStorage as the persistence
 * store. Models two tables:
 *
 *   students[]         → localStorage key: "sam_students"
 *   attendanceRecords[]→ localStorage key: "sam_attendance"
 *
 * Student schema:
 *   { id, name, rollNo, grade, division, phone, createdAt }
 *
 * Attendance schema:
 *   { id, studentId, date, status }
 *   date  = "YYYY-MM-DD"  (ISO string, never overwritten)
 *   status = "Present" | "Absent"
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import {
  getAllStudents,
  addStudent as apiAddStudent,
  updateStudent as apiUpdateStudent,
  deleteStudent as apiDeleteStudent,
} from "../services/studentService.js";
import {
  getAllAttendance,
  markAttendance as apiMarkAttendance,
} from "../services/attendanceService.js";
import { adminRegisterStudent } from "../services/authService.js";

// ── Storage Keys ─────────────────────────────────────────
const STUDENTS_KEY    = "sam_students";
const ATTENDANCE_KEY  = "sam_attendance";

// ── Helpers ───────────────────────────────────────────────
const load = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const save = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("localStorage write failed:", e);
  }
};

// ── Date Utilities ────────────────────────────────────────
export const todayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const nDaysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, day] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(day, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
};

export const formatDateFull = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", {
    weekday: "short", year: "numeric", month: "long", day: "numeric"
  });
};

// Return all dates in [start, end] inclusive as "YYYY-MM-DD" strings in local time
export const dateRange = (start, end) => {
  const dates = [];
  const cur = new Date(start + "T00:00:00");
  const last = new Date(end + "T00:00:00");
  while (cur <= last) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, "0");
    const d = String(cur.getDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

// Helper to reliably match a student object with an attendance record
export const isSameStudent = (student, record) => {
  if (!student || !record) return false;
  const sId1 = String(student.id || "");
  const sId2 = String(student.student_id || "");
  const sRoll = String(student.rollNo || student.roll_number || "").trim().toLowerCase();

  const rId1 = String(record.studentId || "");
  const rId2 = String(record.student_id || record.student || "");
  const rRoll = String(record.roll_number || record.rollNo || "").trim().toLowerCase();

  if (sId1 && (sId1 === rId1 || sId1 === rId2)) return true;
  if (sId2 && (sId2 === rId1 || sId2 === rId2)) return true;
  if (sRoll && rRoll && sRoll === rRoll) return true;
  return false;
};

// ── Seed Data (loaded only when localStorage is empty) ───
const generateSeedData = () => {
  return { seedStudents: [], seedAttendance: [] };
};

// ── Main Hook ─────────────────────────────────────────────
export function useAttendanceStore() {
  const [students, setStudents]           = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoaded, setIsLoaded]           = useState(false);

  // Load from API or localStorage on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Try fetching from API first
        const apiStudents = await getAllStudents();
        const apiAttendance = await getAllAttendance();

        // Normalize API student objects → frontend schema
        // Backend: { student_id, roll_number, user_details:{full_name}, student_class:{class_name}, department:{department_name} }
        // Frontend: { id, student_id, name, rollNo, grade, division, phone }
        const studentList = Array.isArray(apiStudents) ? apiStudents : (apiStudents?.results || []);
        const attList = Array.isArray(apiAttendance) ? apiAttendance : (apiAttendance?.results || []);

        // Normalize API student objects → frontend schema
        const normalizedStudents = studentList.map((s) => ({
          id: String(s.student_id || s.id || s.pk),
          student_id: s.student_id || s.id || s.pk,
          name: s.user_details?.full_name || s.name || s.full_name || "Unknown",
          rollNo: s.roll_number || s.rollNo || "",
          email: s.user_details?.email || s.email || "",
          grade: s.class_name || s.student_class?.class_name || s.grade || "",
          class_id: s.student_class?.class_id || s.student_class?.id || s.class_id || null,
          division: s.division_name || s.division?.division_name || s.branch_name || s.division || "",
          phone: s.user_details?.mobile || s.phone || "",
          department: s.department_name || s.department?.department_name || s.department || "",
          createdAt: s.created_at || s.createdAt || todayStr(),
        }));

        // Normalize API attendance objects → frontend schema
        const normalizedAttendance = attList.map((a) => ({
          id: String(a.attendance_id || a.id),
          attendance_id: a.attendance_id || a.id,
          studentId: String(a.student || a.student_id || ""),
          date: a.date || a.attendance_date || "",
          attendance_date: a.attendance_date || a.date || "",
          status: a.status || "Present",
          student_name: a.student_name || "",
          roll_number: a.roll_number || "",
          department_name: a.department_name || "",
          class_name: a.class_name || "",
          semester_name: a.semester_name || "",
          subject_name: a.subject_name || "",
          attendance_time: a.attendance_time || "",
          marked_by: a.marked_by || "Admin",
        }));

        setStudents(normalizedStudents);

        // Filter attendance records to only keep records for valid active students (Roll No 1-6 or newly registered)
        const validRolls = new Set(normalizedStudents.map((s) => String(s.rollNo)));
        const filteredAttendance = normalizedAttendance.filter((a) => {
          const roll = String(a.roll_number || "").trim();
          return !roll || validRolls.has(roll);
        });

        setAttendanceRecords(filteredAttendance);
        setIsLoaded(true);

        // Update local storage with fresh normalized data
        save(STUDENTS_KEY, normalizedStudents);
        save(ATTENDANCE_KEY, filteredAttendance);
      } catch (err) {
        console.warn("API unavailable, falling back to local storage:", err);

        // Fallback to local storage logic
        let storedStudents   = load(STUDENTS_KEY);
        let storedAttendance = load(ATTENDANCE_KEY);

        // First-time load: seed with sample data
        if (!storedStudents || storedStudents.length === 0) {
          const { seedStudents, seedAttendance } = generateSeedData();
          storedStudents   = seedStudents;
          storedAttendance = seedAttendance;
          save(STUDENTS_KEY, seedStudents);
          save(ATTENDANCE_KEY, seedAttendance);
        }

        setStudents(storedStudents);
        setAttendanceRecords(storedAttendance || []);
        setIsLoaded(true);
      }
    };

    initializeData();
  }, []);

  // Persist whenever state changes (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    save(STUDENTS_KEY, students);
  }, [students, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    save(ATTENDANCE_KEY, attendanceRecords);
  }, [attendanceRecords, isLoaded]);

  // ── Student CRUD ────────────────────────────────────────

  /** Returns error string or null (async when email+password provided) */
  const addStudent = useCallback(async (studentData) => {
    const { name, rollNo, grade, division, phone, email, password, department } = studentData;

    if (!name?.trim() || !rollNo?.trim() || !grade?.trim()) {
      return "Name, Roll Number, and Year are required.";
    }

    // Duplicate roll number check
    const dupRoll = students.find(
      (s) => s.rollNo.trim().toLowerCase() === rollNo.trim().toLowerCase()
    );
    if (dupRoll) {
      return `Roll Number "${rollNo}" is already registered (${dupRoll.name}).`;
    }

    const deptVal = (department || "Computer Engineering").trim();

    // If email + password provided, use the student register API (creates login account)
    if (email && password) {
      const res = await adminRegisterStudent({
        fullName: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone || "",
        roll_number: rollNo.trim(),
        roll_no: rollNo.trim(),
        class_name: grade.trim(),
        division_name: (division || "A").trim(),
        department_name: deptVal,
        department: deptVal,
      });
      // Normalize the returned student for the local store
      const created = res?.student || res?.profile || {};
      const newStudent = {
        id: String(created.student_id || created.id || `s${Date.now()}`),
        student_id: created.student_id || created.id,
        name: created.full_name || created.name || name.trim(),
        rollNo: created.roll_number || rollNo.trim(),
        grade: created.class_name || created.grade || grade.trim(),
        division: created.division_name || created.division || (division || "A").trim(),
        department: created.department_name || created.department || deptVal,
        phone: created.phone_number || created.mobile || phone || "",
        email: email.trim(),
        createdAt: created.created_at || todayStr(),
      };
      setStudents((prev) => [...prev, newStudent]);
      return null; // success
    }

    // Fallback: no email/password — local-only add (legacy path)
    const newStudent = {
      id: `s${Date.now()}`,
      name: name.trim(),
      rollNo: rollNo.trim(),
      grade: grade.trim(),
      division: (division || "A").trim(),
      department: deptVal,
      phone: (phone || "").trim(),
      email: (email || "").trim(),
      createdAt: todayStr(),
    };

    setStudents((prev) => [...prev, newStudent]);

    // Background API sync
    apiAddStudent(newStudent).then((created) => {
      if (created && (created.student_id || created.id)) {
        const realId = String(created.student_id || created.id);
        const realClassId = created.student_class?.class_id || created.student_class?.id || created.class_id || null;
        setStudents((prev) =>
          prev.map((s) =>
            s.id === newStudent.id || s.rollNo === newStudent.rollNo
              ? { ...s, id: realId, student_id: created.student_id || created.id, class_id: realClassId, department: created.department_name || deptVal }
              : s
          )
        );
      }
    }).catch((err) => {
      console.warn("Failed to sync new student to API, saved locally:", err);
    });

    return null; // success
  }, [students]);

  const updateStudent = useCallback(async (id, updates) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    
    try {
      const res = await apiUpdateStudent(id, updates);
      if (res) {
        setStudents((prev) =>
          prev.map((s) => {
            if (s.id === id) {
              return {
                ...s,
                ...updates,
                email: res.user_details?.email || updates.email || s.email,
                name: res.user_details?.full_name || updates.name || s.name,
                phone: res.user_details?.mobile || updates.phone || s.phone,
              };
            }
            return s;
          })
        );
      }
    } catch (err) {
      console.warn("Failed to sync student update to API:", err);
    }
  }, []);

  const deleteStudent = useCallback((id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    // Also delete their attendance records
    setAttendanceRecords((prev) => prev.filter((a) => a.studentId !== id));
    
    // Background API sync
    apiDeleteStudent(id).catch(err => {
      console.warn("Failed to sync student deletion to API:", err);
    });
  }, []);

  // ── Attendance CRUD ─────────────────────────────────────

  /**
  /**
   * Refresh attendance data from backend database.
   */
  const refreshAttendance = useCallback(async () => {
    try {
      const freshAttendance = await getAllAttendance();
      const attList = Array.isArray(freshAttendance) ? freshAttendance : (freshAttendance?.results || []);
      if (attList.length > 0) {
        const normalized = attList.map((a) => ({
          id: String(a.attendance_id || a.id),
          attendance_id: a.attendance_id || a.id,
          studentId: String(a.student || a.student_id || ""),
          date: a.date || a.attendance_date || "",
          attendance_date: a.attendance_date || a.date || "",
          status: a.status || "Present",
          student_name: a.student_name || "",
          roll_number: a.roll_number || "",
          department_name: a.department_name || "",
          class_name: a.class_name || "",
          semester_name: a.semester_name || "",
          subject_name: a.subject_name || "",
          attendance_time: a.attendance_time || "",
          marked_by: a.marked_by || "Admin",
        }));
        setAttendanceRecords(normalized);
        save(ATTENDANCE_KEY, normalized);
      }
    } catch (err) {
      console.warn("Failed to refresh attendance from backend API:", err);
    }
  }, []);

  /**
   * Get attendance for a specific date.
   * Returns array: [{ student, record | null }]
   */
// ── Query Utilities ─────────────────────────────────────

  /**
   * Get attendance for a specific date.
   * Returns array: [{ student, record | null }]
   */
  /**
   * Get attendance for a specific date.
   * Returns array: [{ student, record | null }]
   */
  const getAttendanceForDate = useCallback((date) => {
    return students.map((student) => {
      const record = attendanceRecords.find(
        (a) => a && isSameStudent(student, a) && ((a.date || a.attendance_date) === date)
      );
      return { student, record: record || null };
    });
  }, [students, attendanceRecords]);

  /**
   * Check if attendance has been saved for a given date.
   */
  const isAttendanceSaved = useCallback((date) => {
    return attendanceRecords.some((a) => a && (a.date === date || a.attendance_date === date));
  }, [attendanceRecords]);

  /**
   * Save attendance for a full date (upsert).
   * statusMap: { studentId: "Present" | "Absent" }
   * Does NOT overwrite if attendance already saved — returns error.
   * Pass force=true to overwrite.
   */
  const saveAttendanceForDate = useCallback(async (date, statusMap, force = false) => {
    const alreadySaved = attendanceRecords.some((a) => a && (a.date === date || a.attendance_date === date));
    if (alreadySaved && !force) {
      return "Attendance for this date already exists. Use Edit mode to modify.";
    }

    const payloadRecords = Object.entries(statusMap).map(([studentId, status]) => {
      const st = students.find((s) => s && (String(s.id) === String(studentId) || String(s.student_id) === String(studentId)));
      const realStudentId = st?.student_id || st?.id || studentId;
      const rec = {
        student_id: realStudentId,
        roll_number: st?.rollNo || st?.roll_number || "",
        student_name: st?.name || st?.full_name || "",
        status,
      };
      // Send class_id so backend sets student_class on the Attendance record
      if (st?.class_id) rec.class_id = st.class_id;
      return rec;
    });

    const userObj = load("user");
    const markedBy = userObj?.full_name || (userObj?.role ? userObj.role.charAt(0).toUpperCase() + userObj.role.slice(1) : "Admin");

    // Always update local state immediately so UI updates zero latency
    const localNewRecords = Object.entries(statusMap).map(([studentId, status]) => {
      const st = students.find((s) => s && (String(s.id) === String(studentId) || String(s.student_id) === String(studentId)));
      return {
        id: `a_${Date.now()}_${studentId}`,
        attendance_id: `a_${Date.now()}_${studentId}`,
        studentId: String(studentId),
        student_id: st?.student_id || st?.id || studentId,
        date,
        attendance_date: date,
        status,
        student_name: st?.name || st?.full_name || "Unknown",
        roll_number: st?.rollNo || st?.roll_number || "",
        class_name: st?.grade || st?.student_class?.class_name || "",
        marked_by: markedBy,
        attendance_time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
    });

    setAttendanceRecords((prev) => {
      const filtered = prev.filter((a) => a && (a.date !== date && a.attendance_date !== date));
      return [...filtered, ...localNewRecords];
    });

    try {
      await apiMarkAttendance({
        date,
        marked_by: markedBy,
        records: payloadRecords,
      });

      await refreshAttendance();
      return null; // success
    } catch (err) {
      console.warn("Backend attendance save failed, attendance retained locally:", err);
      return null; // success locally
    }
  }, [attendanceRecords, students, refreshAttendance]);

  /**
   * Get all attendance records in a date range.
   * Returns sorted by date DESC.
   */
  const getAttendanceByRange = useCallback((startDate, endDate) => {
    const dates = dateRange(startDate, endDate);
    const dateSet = new Set(dates);

    const records = attendanceRecords
      .filter((a) => a && dateSet.has(a.date || a.attendance_date))
      .map((a) => {
        const student = students.find((s) => isSameStudent(s, a));
        return {
          ...a,
          date: a ? (a.date || a.attendance_date) : "",
          student: student || null,
        };
      })
      .filter((a) => a.student !== null);

    records.sort((a, b) => {
      const dA = a ? (a.date || "") : "";
      const dB = b ? (b.date || "") : "";
      return dB.localeCompare(dA);
    });
    return records;
  }, [attendanceRecords, students]);

  /**
   * Get attendance summary for a student over a date range.
   * Returns: { presentDays, absentDays, totalDays, percentage, records }
   */
  const getStudentSummary = useCallback((studentId, startDate, endDate) => {
    const dates = dateRange(startDate, endDate);
    const dateSet = new Set(dates);
    const targetStudent = students.find(
      (s) => s && (String(s.id) === String(studentId) || String(s.student_id) === String(studentId))
    );

    const records = attendanceRecords
      .filter((a) => {
        if (!a) return false;
        const aDate = a.date || a.attendance_date;
        const matchesStudent = targetStudent
          ? isSameStudent(targetStudent, a)
          : (String(a.studentId) === String(studentId) || String(a.student_id) === String(studentId));
        return matchesStudent && dateSet.has(aDate);
      })
      .sort((a, b) => {
        const dA = a ? (a.date || a.attendance_date || "") : "";
        const dB = b ? (b.date || b.attendance_date || "") : "";
        return dB.localeCompare(dA);
      });

    const presentDays = records.filter((r) => r && r.status && String(r.status).toLowerCase() === "present").length;
    const absentDays  = records.filter((r) => r && r.status && String(r.status).toLowerCase() === "absent").length;
    const totalDays   = records.length;
    const percentage  = totalDays > 0
      ? parseFloat(((presentDays / totalDays) * 100).toFixed(1))
      : 0;

    return { presentDays, absentDays, totalDays, percentage, records };
  }, [students, attendanceRecords]);

  /**
   * Get today's stats: { total, presentToday, absentToday, rate }
   */
  const getTodayStats = useCallback(() => {
    const today = todayStr();
    const todayRecords = attendanceRecords.filter((a) => a && (a.date || a.attendance_date) === today);
    const presentToday = todayRecords.filter((a) => a && a.status && String(a.status).toLowerCase() === "present").length;
    const absentToday  = todayRecords.filter((a) => a && a.status && String(a.status).toLowerCase() === "absent").length;
    const total        = students.length;
    const rate         = todayRecords.length > 0
      ? parseFloat(((presentToday / todayRecords.length) * 100).toFixed(1))
      : 0;

    return { total, presentToday, absentToday, rate, hasToday: todayRecords.length > 0 };
  }, [students, attendanceRecords]);

  /**
   * Get recent attendance records (last N records, sorted by date DESC, then rollNo ASC).
   */
  const getRecentAttendance = useCallback((limit = 20) => {
    const recordsWithStudent = attendanceRecords
      .map((a) => {
        const st = students.find((s) => isSameStudent(s, a));
        return {
          ...a,
          date: a ? (a.date || a.attendance_date || "") : "",
          student: st || null,
          rollNo: st?.rollNo || a?.roll_number || a?.rollNo || "",
        };
      })
      .filter((a) => a && a.student);

    recordsWithStudent.sort((a, b) => {
      const dA = a.date;
      const dB = b.date;
      if (dA !== dB) return dB.localeCompare(dA);

      const numA = parseInt(a.rollNo, 10);
      const numB = parseInt(b.rollNo, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return String(a.rollNo).localeCompare(String(b.rollNo), undefined, { numeric: true, sensitivity: "base" });
    });

    return recordsWithStudent.slice(0, limit);
  }, [attendanceRecords, students]);

  /**
   * Search students by name (partial), rollNo, grade, or division.
   * Case-insensitive, instant.
   */
  const searchStudents = useCallback((query) => {
    if (!query || !query.trim()) return students;
    const q = query.trim().toLowerCase();
    return students.filter((s) =>
      s && (
        s.name.toLowerCase().includes(q)       ||
        s.rollNo.toLowerCase().includes(q)     ||
        s.grade.toLowerCase().includes(q)      ||
        s.division.toLowerCase().includes(q)   ||
        (s.phone && s.phone.includes(q))
      )
    );
  }, [students]);

  /**
   * Get all unique dates that have attendance records (sorted DESC).
   */
  const getAttendanceDates = useCallback(() => {
    const dates = [...new Set(attendanceRecords.map((a) => a ? (a.date || a.attendance_date) : null))].filter(Boolean);
    return dates.sort((a, b) => b.localeCompare(a));
  }, [attendanceRecords]);

  /**
   * Get summary per student for a date range.
   * Returns array sorted by student name.
   */
  const getRangeSummaryPerStudent = useCallback((startDate, endDate) => {
    const list = students.map((student) => {
      const summary = getStudentSummary(student.id, startDate, endDate);
      return { student, ...summary };
    });
    return list.sort((a, b) => {
      const numA = parseInt(a.student?.rollNo, 10);
      const numB = parseInt(b.student?.rollNo, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return String(a.student?.rollNo || "").localeCompare(String(b.student?.rollNo || ""), undefined, { numeric: true, sensitivity: "base" });
    });
  }, [students, getStudentSummary]);

  // ── Class / Division Lists ──────────────────────────────
  const uniqueGrades = useCallback(() => {
    return [...new Set(students.map((s) => s.grade))].sort();
  }, [students]);

  const uniqueDivisions = useCallback(() => {
    return [...new Set(students.map((s) => s.division))].sort();
  }, [students]);

  return {
    // State
    students,
    attendanceRecords,
    isLoaded,

    // Student ops
    addStudent,
    updateStudent,
    deleteStudent,

    // Attendance ops
    getAttendanceForDate,
    isAttendanceSaved,
    saveAttendanceForDate,
    refreshAttendance,

    // Query
    getAttendanceByRange,
    getStudentSummary,
    getTodayStats,
    getRecentAttendance,
    searchStudents,
    getAttendanceDates,
    getRangeSummaryPerStudent,

    // Meta
    uniqueGrades,
    uniqueDivisions,
  };
}
