/**
 * teacherService.js
 * ─────────────────────────────────────────────────────────
 * Handles all Teacher API calls:
 *   GET    /api/teachers/
 *   POST   /api/teachers/
 *   PUT    /api/teachers/:id/
 *   DELETE /api/teachers/:id/
 * ─────────────────────────────────────────────────────────
 */

import apiClient from "./apiClient.js";

/**
 * Fetch all teachers
 * @returns {Promise<Array>} teachers[]
 */
export const getAllTeachers = () => apiClient.get("/api/teachers/");

/**
 * Add a new teacher
 * @param {Object} teacherData
 * @returns {Promise<Object>}
 */
export const addTeacher = (teacherData) => apiClient.post("/api/teachers/", teacherData);

/**
 * Update an existing teacher
 * @param {string|number} id
 * @param {Object} teacherData
 * @returns {Promise<Object>}
 */
export const updateTeacher = (id, teacherData) =>
  apiClient.put(`/api/teachers/${id}/`, teacherData);

/**
 * Delete a teacher
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export const deleteTeacher = (id) => apiClient.delete(`/api/teachers/${id}/`);
