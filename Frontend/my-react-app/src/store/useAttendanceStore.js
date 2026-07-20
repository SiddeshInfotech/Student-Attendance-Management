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

// ── Seed Data (loaded only when localStorage is empty) ───
const generateSeedData = () => {
  const today = new Date();

  const seedStudents = [
    { id: "s1",  name: "Aarav Sharma",   rollNo: "101", grade: "Grade 10", division: "A", phone: "9876543210", createdAt: nDaysAgo(60) },
    { id: "s2",  name: "Diya Patel",     rollNo: "102", grade: "Grade 10", division: "A", phone: "9876543211", createdAt: nDaysAgo(60) },
    { id: "s3",  name: "Kabir Mehta",    rollNo: "103", grade: "Grade 11", division: "B", phone: "9876543212", createdAt: nDaysAgo(60) },
    { id: "s4",  name: "Isha Iyer",      rollNo: "104", grade: "Grade 12", division: "A", phone: "9876543213", createdAt: nDaysAgo(60) },
    { id: "s5",  name: "Rohan Das",      rollNo: "105", grade: "Grade 9",  division: "C", phone: "9876543214", createdAt: nDaysAgo(60) },
    { id: "s6",  name: "Ananya Sen",     rollNo: "106", grade: "Grade 11", division: "B", phone: "9876543215", createdAt: nDaysAgo(60) },
    { id: "s7",  name: "Dev Shah",       rollNo: "107", grade: "Grade 12", division: "A", phone: "9876543216", createdAt: nDaysAgo(60) },
    { id: "s8",  name: "Meera Nair",     rollNo: "108", grade: "Grade 9",  division: "C", phone: "9876543217", createdAt: nDaysAgo(60) },
    { id: "s9",  name: "Vivaan Kapoor",  rollNo: "109", grade: "Grade 11", division: "B", phone: "9876543218", createdAt: nDaysAgo(60) },
    { id: "s10", name: "Aditi Rao",      rollNo: "110", grade: "Grade 10", division: "A", phone: "9876543219", createdAt: nDaysAgo(60) },
    { id: "s11", name: "Ritesh Patel",   rollNo: "111", grade: "Grade 10", division: "B", phone: "9876543220", createdAt: nDaysAgo(45) },
    { id: "s12", name: "Ritesh Kumar",   rollNo: "112", grade: "Grade 11", division: "A", phone: "9876543221", createdAt: nDaysAgo(45) },
    { id: "s13", name: "Ritesh Sharma",  rollNo: "113", grade: "Grade 9",  division: "C", phone: "9876543222", createdAt: nDaysAgo(45) },
    { id: "s14", name: "Ritesh Yadav",   rollNo: "114", grade: "Grade 12", division: "B", phone: "9876543223", createdAt: nDaysAgo(45) },
    { id: "s15", name: "Priya Gupta",    rollNo: "115", grade: "Grade 9",  division: "A", phone: "9876543224", createdAt: nDaysAgo(30) },
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

  // Load from localStorage on mount
  useEffect(() => {
    let storedStudents    = load(STUDENTS_KEY);
    let storedAttendance  = load(ATTENDANCE_KEY);

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
    return null; // success
  }, [students]);

  const updateStudent = useCallback((id, updates) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteStudent = useCallback((id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    // Also delete their attendance records
    setAttendanceRecords((prev) => prev.filter((a) => a.studentId !== id));
  }, []);

  // ── Attendance CRUD ─────────────────────────────────────

  /**
   * Get attendance for a specific date.
   * Returns array: [{ student, record | null }]
   */
  const getAttendanceForDate = useCallback((date) => {
    return students.map((student) => {
      const record = attendanceRecords.find(
        (a) => a.studentId === student.id && a.date === date
      );
      return { student, record: record || null };
    });
  }, [students, attendanceRecords]);

  /**
   * Check if attendance has been saved for a given date.
   */
  const isAttendanceSaved = useCallback((date) => {
    return attendanceRecords.some((a) => a.date === date);
  }, [attendanceRecords]);

  /**
   * Save attendance for a full date (upsert).
   * statusMap: { studentId: "Present" | "Absent" }
   * Does NOT overwrite if attendance already saved — returns error.
   * Pass force=true to overwrite.
   */
  const saveAttendanceForDate = useCallback((date, statusMap, force = false) => {
    const alreadySaved = attendanceRecords.some((a) => a.date === date);
    if (alreadySaved && !force) {
      return "Attendance for this date already exists. Use Edit mode to modify.";
    }

    setAttendanceRecords((prev) => {
      // Remove all existing records for this date
      const filtered = prev.filter((a) => a.date !== date);
      // Add new records
      const newRecords = Object.entries(statusMap).map(([studentId, status]) => ({
        id: `a${Date.now()}_${studentId}`,
        studentId,
        date,
        status,
      }));
      return [...filtered, ...newRecords];
    });
    return null; // success
  }, [attendanceRecords]);

  // ── Query Utilities ─────────────────────────────────────

  /**
   * Get all attendance records in a date range.
   * Returns sorted by date DESC.
   */
  const getAttendanceByRange = useCallback((startDate, endDate) => {
    const dates = dateRange(startDate, endDate);
    const dateSet = new Set(dates);

    const records = attendanceRecords
      .filter((a) => dateSet.has(a.date))
      .map((a) => ({
        ...a,
        student: students.find((s) => s.id === a.studentId) || null,
      }))
      .filter((a) => a.student !== null);

    // Sort by date DESC
    records.sort((a, b) => b.date.localeCompare(a.date));
    return records;
  }, [attendanceRecords, students]);

  /**
   * Get attendance summary for a student over a date range.
   * Returns: { presentDays, absentDays, totalDays, percentage, records }
   */
  const getStudentSummary = useCallback((studentId, startDate, endDate) => {
    const dates = dateRange(startDate, endDate);
    const dateSet = new Set(dates);

    const records = attendanceRecords
      .filter((a) => a.studentId === studentId && dateSet.has(a.date))
      .sort((a, b) => b.date.localeCompare(a.date));

    const presentDays = records.filter((r) => r.status === "Present").length;
    const absentDays  = records.filter((r) => r.status === "Absent").length;
    const totalDays   = records.length;
    const percentage  = totalDays > 0
      ? parseFloat(((presentDays / totalDays) * 100).toFixed(1))
      : 0;

    return { presentDays, absentDays, totalDays, percentage, records };
  }, [attendanceRecords]);

  /**
   * Get today's stats: { total, presentToday, absentToday, rate }
   */
  const getTodayStats = useCallback(() => {
    const today = todayStr();
    const todayRecords = attendanceRecords.filter((a) => a.date === today);
    const presentToday = todayRecords.filter((a) => a.status === "Present").length;
    const absentToday  = todayRecords.filter((a) => a.status === "Absent").length;
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
    const sorted = [...attendanceRecords].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.slice(0, limit).map((a) => ({
      ...a,
      student: students.find((s) => s.id === a.studentId) || null,
    })).filter((a) => a.student);
  }, [attendanceRecords, students]);

  /**
   * Search students by name (partial), rollNo, grade, or division.
   * Case-insensitive, instant.
   */
  const searchStudents = useCallback((query) => {
    if (!query || !query.trim()) return students;
    const q = query.trim().toLowerCase();
    return students.filter((s) =>
      s.name.toLowerCase().includes(q)       ||
      s.rollNo.toLowerCase().includes(q)     ||
      s.grade.toLowerCase().includes(q)      ||
      s.division.toLowerCase().includes(q)   ||
      (s.phone && s.phone.includes(q))
    );
  }, [students]);

  /**
   * Get all unique dates that have attendance records (sorted DESC).
   */
  const getAttendanceDates = useCallback(() => {
    const dates = [...new Set(attendanceRecords.map((a) => a.date))];
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
