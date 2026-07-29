/**
 * profileService.js
 * ─────────────────────────────────────────────────────────
 * Handles Admin/Student Profile fetches and updates:
 *   GET /api/profile
 *   PUT /api/profile
 *   PUT /api/profile/password
 * ─────────────────────────────────────────────────────────
 */

import apiClient, { setUser } from "./apiClient.js";

/**
 * Fetch current user profile
 * @returns {Promise<Object>}
 */
export const getProfile = () => apiClient.get("/api/profile");

/**
 * Update current user profile
 * @param {{ name?: string, email?: string, phone?: string }} data
 * @returns {Promise<Object>}
 */
export const updateProfile = async (data) => {
  const res = await apiClient.put("/api/profile", data);
  if (res.user) {
    // Update local storage user data
    setUser(res.user);
  }
  return res;
};

/**
 * Change Password
 * @param {{ currentPassword: string, newPassword: string }} data
 * @returns {Promise<Object>}
 */
export const changePassword = (data) => apiClient.put("/api/profile/password", data);
