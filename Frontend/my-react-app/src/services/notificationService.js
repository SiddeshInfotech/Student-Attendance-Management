/**
 * notificationService.js
 * ─────────────────────────────────────────────────────────
 * Handles Notifications for users:
 *   GET /api/notifications
 *   PUT /api/notifications/:id/read
 *   PUT /api/notifications/read-all
 * ─────────────────────────────────────────────────────────
 */

import apiClient from "./apiClient.js";

/**
 * Fetch all notifications for the current user
 * @returns {Promise<Array>}
 */
export const getNotifications = () => apiClient.get("/api/notifications");

/**
 * Mark a single notification as read
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const markAsRead = (id) => apiClient.put(`/api/notifications/${id}/read`);

/**
 * Mark all notifications as read
 * @returns {Promise<Object>}
 */
export const markAllAsRead = () => apiClient.put("/api/notifications/read-all");
