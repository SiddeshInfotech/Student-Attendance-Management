/**
 * attendanceService.js
 * ─────────────────────────────────────────────────────────
 * Handles all Attendance API calls:
 *   POST   /api/attendance
 *   GET    /api/attendance
 *   GET    /api/attendance/date?date=YYYY-MM-DD
 *   GET    /api/attendance/student/:studentId
 *   PUT    /api/attendance/:id
 *   DELETE /api/attendance/:id
 *   GET    /api/attendance/percentage/:studentId
 *   GET    /api/attendance/today
 * ─────────────────────────────────────────────────────────
 */

import apiClient from "./apiClient.js";

/**
 * Mark attendance for one or multiple students
 * @param {{ records: Array<{studentId: string, date: string, status: string}> }} attendanceData
 * @returns {Promise<Object>}
 */
export const markAttendance = (attendanceData) =>
  apiClient.post("/api/attendance", attendanceData);

/**
 * Fetch all attendance records
 * @returns {Promise<Array>}
 */
export const getAllAttendance = () => apiClient.get("/api/attendance");

/**
 * Get today's attendance summary
 * @returns {Promise<Object>}
 */
export const getTodayAttendance = () => apiClient.get("/api/attendance/today");

/**
 * Get attendance records for a specific date
 * @param {string} date - "YYYY-MM-DD"
 * @returns {Promise<Array>}
 */
export const getAttendanceByDate = (date) =>
  apiClient.get(`/api/attendance/date?date=${date}`);

/**
 * Get all attendance records for a specific student
 * @param {string} studentId
 * @returns {Promise<Array>}
 */
export const getAttendanceByStudent = (studentId) =>
  apiClient.get(`/api/attendance/student/${studentId}`);

/**
 * Update a specific attendance record
 * @param {string} id - attendance record ID
 * @param {{ status: string }} data
 * @returns {Promise<Object>}
 */
export const updateAttendance = (id, data) =>
  apiClient.put(`/api/attendance/${id}`, data);

/**
 * Delete a specific attendance record
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteAttendance = (id) =>
  apiClient.delete(`/api/attendance/${id}`);

/**
 * Get attendance percentage for a student
 * @param {string} studentId
 * @returns {Promise<{percentage: number, present: number, absent: number, total: number}>}
 */
export const getAttendancePercentage = (studentId) =>
  apiClient.get(`/api/attendance/percentage/${studentId}`);

/**
 * Get attendance stats in a date range
 * @param {string} startDate - "YYYY-MM-DD"
 * @param {string} endDate   - "YYYY-MM-DD"
 * @returns {Promise<Array>}
 */
export const getAttendanceRange = (startDate, endDate) =>
  apiClient.get(`/api/attendance/range?start=${startDate}&end=${endDate}`);
