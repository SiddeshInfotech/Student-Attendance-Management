/**
 * authService.js
 * ─────────────────────────────────────────────────────────
 * Handles all Authentication API calls:
 *   POST /api/auth/admin/signup
 *   POST /api/auth/admin/login
 *   POST /api/auth/student/signup
 *   POST /api/auth/student/login
 *   POST /api/auth/forgot-password
 *   POST /api/auth/reset-password
 *   POST /api/auth/logout
 * ─────────────────────────────────────────────────────────
 */

import apiClient, { setToken, setUser, removeToken, removeUser } from "./apiClient.js";

// ── Admin Auth ────────────────────────────────────────────

/**
 * Admin Signup
 * @param {{ fullName: string, email: string, password: string }} data
 */
export const adminSignup = async (data) => {
  const res = await apiClient.post("/api/auth/admin/signup", data);
  if (res.token) {
    setToken(res.token);
    setUser({ ...res.user, role: "admin" });
  }
  return res;
};

/**
 * Admin Login
 * @param {{ email: string, password: string }} data
 */
export const adminLogin = async (data) => {
  const res = await apiClient.post("/api/auth/admin/login", data);
  if (res.token) {
    setToken(res.token);
    setUser({ ...res.user, role: "admin" });
  }
  return res;
};

// ── Student Auth ──────────────────────────────────────────

/**
 * Student Signup
 * @param {{ fullName: string, email: string, rollNo: string, password: string }} data
 */
export const studentSignup = async (data) => {
  const res = await apiClient.post("/api/auth/student/signup", data);
  if (res.token) {
    setToken(res.token);
    setUser({ ...res.user, role: "student" });
  }
  return res;
};

/**
 * Student Login
 * @param {{ email: string, password: string }} data
 */
export const studentLogin = async (data) => {
  const res = await apiClient.post("/api/auth/student/login", data);
  if (res.token) {
    setToken(res.token);
    setUser({ ...res.user, role: "student" });
  }
  return res;
};

// ── Password Reset ────────────────────────────────────────

/**
 * Forgot Password — sends reset link to email
 * @param {string} email
 */
export const forgotPassword = async (email) => {
  return apiClient.post("/api/auth/forgot-password", { email });
};

/**
 * Reset Password — uses token from email link
 * @param {{ token: string, newPassword: string }} data
 */
export const resetPassword = async (data) => {
  return apiClient.post("/api/auth/reset-password", data);
};

// ── Logout ────────────────────────────────────────────────

/**
 * Logout — clears token and user from localStorage
 */
export const logout = async () => {
  try {
    await apiClient.post("/api/auth/logout", {});
  } catch (_) {
    // Silently ignore logout API errors — always clear local state
  } finally {
    removeToken();
    removeUser();
  }
};
