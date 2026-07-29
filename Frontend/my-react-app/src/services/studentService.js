/**
 * studentService.js
 * ─────────────────────────────────────────────────────────
 * Handles all Student API calls:
 *   GET    /api/students
 *   GET    /api/students/count
 *   GET    /api/students/search?q={keyword}
 *   GET    /api/students/:id
 *   POST   /api/students
 *   PUT    /api/students/:id
 *   DELETE /api/students/:id
 * ─────────────────────────────────────────────────────────
 */

import apiClient from "./apiClient.js";

/**
 * Fetch all students
 * @returns {Promise<Array>} students[]
 */
export const getAllStudents = () => apiClient.get("/api/students/");

/**
 * Get total student count
 * @returns {Promise<{count: number}>}
 */
export const getStudentCount = () => apiClient.get("/api/students/count");

/**
 * Search students by name or roll number
 * @param {string} keyword
 * @returns {Promise<Array>}
 */
export const searchStudents = (keyword) =>
  apiClient.get(`/api/students/search?q=${encodeURIComponent(keyword)}`);

/**
 * Get a single student by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getStudentById = (id) => apiClient.get(`/api/students/${id}`);

/**
 * Add a new student
 * @param {{ name: string, rollNo: string, grade: string, division: string, phone: string }} studentData
 * @returns {Promise<Object>}
 */
export const addStudent = (studentData) => apiClient.post("/api/students", studentData);

/**
 * Update an existing student
 * @param {string} id
 * @param {Object} studentData
 * @returns {Promise<Object>}
 */
export const updateStudent = (id, studentData) =>
  apiClient.put(`/api/students/${id}`, studentData);

/**
 * Delete a student
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteStudent = (id) => apiClient.delete(`/api/students/${id}`);
