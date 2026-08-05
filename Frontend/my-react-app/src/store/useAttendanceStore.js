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
  return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
};

export const nDaysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
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

// Return all dates in [start, end] inclusive as "YYYY-MM-DD" strings
export const dateRange = (start, end) => {
  const dates = [];
  const cur = new Date(start + "T00:00:00");
  const last = new Date(end + "T00:00:00");
  while (cur <= last) {
    dates.push(cur.toISOString().split("T")[0]);
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
  const today = new Date();

  const seedStudents = [
    { id: "s1",  name: "Aarav Sharma",   rollNo: "101", grade: "Grade 10", division: "A", phone: "9876543210", createdAt: nDaysAgo(60) },
    { id: "s2",  name: "Diya Patel",     rollNo: "102", grade: "Grade 10", division: "A", phone: "9876543211", createdAt: nDaysAgo(60) },
    { id: "s3",  name: "Kabir Mehta",    rollNo: "103", grade: "Grade 11", division: "B", phone: "9876543212", createdAt: nDaysAgo(60) },
    { id: "s4",  name: "Isha Iyer",      rollNo: "104", grade: "Grade 12", division: "A", phone: "9876543213", createdAt: nDaysAgo(60) },
    { id: "s5",  name: "Rohan Das",      rollNo: "105", grade: "Grade 9",  division: "C", phone: "9876543214", createdAt: nDaysAgo(60) },
    { id: "s6",  name: "Ananya Sen",     rollNo: "106", grade: "Grade 3",  division: "B", phone: "9876543215", createdAt: nDaysAgo(60) },
    { id: "s7",  name: "Dev Shah",       rollNo: "107", grade: "Grade 4",  division: "A", phone: "9876543216", createdAt: nDaysAgo(60) },
    { id: "s8",  name: "Meera Nair",     rollNo: "108", grade: "Grade 9",  division: "C", phone: "9876543217", createdAt: nDaysAgo(60) },
    { id: "s9",  name: "Vivaan Kapoor",  rollNo: "109", grade: "Grade 5",  division: "B", phone: "9876543218", createdAt: nDaysAgo(60) },
    { id: "s10", name: "Aditi Rao",      rollNo: "110", grade: "Grade 10", division: "A", phone: "9876543219", createdAt: nDaysAgo(60) },
    { id: "s11", name: "Ritesh Patel",   rollNo: "111", grade: "Grade 6",  division: "B", phone: "9876543220", createdAt: nDaysAgo(45) },
    { id: "s12", name: "Ritesh Kumar",   rollNo: "112", grade: "Grade 7",  division: "A", phone: "9876543221", createdAt: nDaysAgo(45) },
    { id: "s13", name: "Ritesh Sharma",  rollNo: "113", grade: "Grade 8",  division: "C", phone: "9876543222", createdAt: nDaysAgo(45) },
    { id: "s14", name: "Ritesh Yadav",   rollNo: "114", grade: "Grade 11", division: "B", phone: "9876543223", createdAt: nDaysAgo(45) },
    { id: "s15", name: "Priya Gupta",    rollNo: "115", grade: "Grade 12", division: "A", phone: "9876543224", createdAt: nDaysAgo(30) },
  ];

  // Seed 30 days of attendance for all students
  const seedAttendance = [];
  let attId = 1;
  for (let d = 30; d >= 0; d--) {
    const date = nDaysAgo(d);
    seedStudents.forEach((student) => {
      // Weighted random: 80% present, 20% absent
      const status = Math.random() < 0.80 ? "Present" : "Absent";
      seedAttendance.push({
        id: `a${attId++}`,
        studentId: student.id,
        date,
        status,
      });
    });
  }

  return { seedStudents, seedAttendance };
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
          grade: s.class_name || s.student_class?.class_name || s.grade || "",
          division: s.branch_name || s.branch?.branch_name || s.division || "",
          phone: s.user_details?.mobile || s.phone || "",
          department: s.department_name || s.department?.department_name || "",
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
        setAttendanceRecords(normalizedAttendance);
        setIsLoaded(true);

        // Update local storage with fresh normalized data
        save(STUDENTS_KEY, normalizedStudents);
        save(ATTENDANCE_KEY, normalizedAttendance);
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

  /** Returns error string or null */
  const addStudent = useCallback((studentData) => {
    const { name, rollNo, grade, division, phone } = studentData;

    if (!name?.trim() || !rollNo?.trim() || !grade?.trim()) {
      return "Name, Roll Number, and Grade are required.";
    }

    // Duplicate roll number check
    const dupRoll = students.find(
      (s) => s.rollNo.trim().toLowerCase() === rollNo.trim().toLowerCase()
    );
    if (dupRoll) {
      return `Roll Number "${rollNo}" is already registered (${dupRoll.name}).`;
    }

    const newStudent = {
      id: `s${Date.now()}`,
      name: name.trim(),
      rollNo: rollNo.trim(),
      grade: grade.trim(),
      division: (division || "A").trim(),
      phone: (phone || "").trim(),
      createdAt: todayStr(),
    };

    setStudents((prev) => [...prev, newStudent]);
    
    // Background API sync
    apiAddStudent(newStudent).catch(err => {
      console.warn("Failed to sync new student to API, saved locally:", err);
    });
    
    return null; // success
  }, [students]);

  const updateStudent = useCallback((id, updates) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    
    // Background API sync
    apiUpdateStudent(id, updates).catch(err => {
      console.warn("Failed to sync student update to API:", err);
    });
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
      return {
        student_id: realStudentId,
        roll_number: st?.rollNo || st?.roll_number || "",
        student_name: st?.name || st?.full_name || "",
        status,
      };
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
   * Get recent attendance records (last N records, sorted by date DESC).
   */
  const getRecentAttendance = useCallback((limit = 20) => {
    const sorted = [...attendanceRecords].sort((a, b) => {
      const dA = a ? (a.date || a.attendance_date || "") : "";
      const dB = b ? (b.date || b.attendance_date || "") : "";
      return dB.localeCompare(dA);
    });
    return sorted.slice(0, limit).map((a) => ({
      ...a,
      date: a ? (a.date || a.attendance_date) : "",
      student: students.find((s) => isSameStudent(s, a)) || null,
    })).filter((a) => a && a.student);
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
    return students.map((student) => {
      const summary = getStudentSummary(student.id, startDate, endDate);
      return { student, ...summary };
    }).sort((a, b) => a.student.name.localeCompare(b.student.name));
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
