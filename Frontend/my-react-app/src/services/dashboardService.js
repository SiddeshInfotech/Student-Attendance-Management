/**
 * dashboardService.js
 * ─────────────────────────────────────────────────────────
 * Handles Dashboard metrics and overview data:
 *   GET /api/dashboard/stats
 *   GET /api/dashboard/recent-activity
 * ─────────────────────────────────────────────────────────
 */

import apiClient from "./apiClient.js";

/**
 * Get core dashboard stats (total students, today's attendance, low attendance count)
 * @returns {Promise<{totalStudents: number, presentToday: number, absentToday: number, lowAttendanceCount: number}>}
 */
export const getDashboardStats = () => apiClient.get("/api/dashboard/stats");

/**
 * Get recent activity feed (e.g. "John Doe was marked present")
 * @returns {Promise<Array>}
 */
export const getRecentActivity = () => apiClient.get("/api/dashboard/recent-activity");
