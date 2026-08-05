/**
 * attendanceService.js
 * ─────────────────────────────────────────────────────────
 * Handles all Attendance API calls:
 *   POST   /api/attendance/
 *   GET    /api/attendance/
 *   GET    /api/attendance/today/
 *   GET    /api/attendance/history/?period=...
 *   GET    /api/attendance/daily/?date=YYYY-MM-DD
 *   GET    /api/attendance/percentage/?student_id=...
 * ─────────────────────────────────────────────────────────
 */

import apiClient from "./apiClient.js";

/**
 * Mark/Save attendance for one or multiple students
 * @param {{ date?: string, class_id?: number, subject_id?: number, marked_by?: string, records: Array<{student_id: string|number, status: string, remarks?: string}> }} attendanceData
 * @returns {Promise<Object>}
 */
export const markAttendance = (attendanceData) =>
  apiClient.post("/api/attendance/", attendanceData);

/**
 * Fetch all attendance records directly from backend DB
 * @returns {Promise<Array>}
 */
export const getAllAttendance = () => apiClient.get("/api/attendance/");

/**
 * Get today's attendance records directly from backend DB
 * @returns {Promise<Array>}
 */
export const getTodayAttendance = () => apiClient.get("/api/attendance/today/");

/**
 * Get filtered attendance history directly from backend DB
 * @param {{ period?: string, start_date?: string, end_date?: string, student_id?: string, status?: string }} params
 * @returns {Promise<Array>}
 */
export const getAttendanceHistory = (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((k) => {
    if (params[k] !== undefined && params[k] !== null && params[k] !== "") {
      cleanParams[k] = params[k];
    }
  });
  const query = new URLSearchParams(cleanParams).toString();
  return apiClient.get(`/api/attendance/history/${query ? `?${query}` : ""}`);
};

/**
 * Get attendance records for a specific date
 * @param {string} date - "YYYY-MM-DD"
 * @returns {Promise<Array>}
 */
export const getAttendanceByDate = (date) =>
  apiClient.get(`/api/attendance/daily/?date=${date}`);

/**
 * Get all attendance records for a specific student
 * @param {string} studentId
 * @returns {Promise<Array>}
 */
export const getAttendanceByStudent = (studentId) =>
  apiClient.get(`/api/attendance/history/?student_id=${studentId}`);

/**
 * Update a specific attendance record
 * @param {string} id - attendance record ID
 * @param {{ status: string }} data
 * @returns {Promise<Object>}
 */
export const updateAttendance = (id, data) =>
  apiClient.put(`/api/attendance/${id}/`, data);

/**
 * Delete a specific attendance record
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteAttendance = (id) =>
  apiClient.delete(`/api/attendance/${id}/`);

/**
 * Get attendance percentage for a student
 * @param {string} studentId
 * @returns {Promise<{percentage: number, present: number, absent: number, total: number}>}
 */
export const getAttendancePercentage = (studentId) =>
  apiClient.get(`/api/attendance/percentage/?student_id=${studentId}`);
