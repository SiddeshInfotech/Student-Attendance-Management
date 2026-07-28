import apiClient, { setToken, setUser, removeToken, removeUser } from "./apiClient.js";

// ── Admin Auth ────────────────────────────────────────────

export const adminSignup = async (data) => {
  const res = await apiClient.post("/api/auth/admin/signup/", data);
  if (res && res.token) {
    setToken(res.token);
    setUser({ ...res.user, role: "admin" });
  }
  return res;
};

export const adminLogin = async (data) => {
  const res = await apiClient.post("/api/auth/admin/login/", data);
  if (res && res.token) {
    setToken(res.token);
    setUser({ ...res.user, role: "admin" });
  }
  return res;
};

// ── Student Auth ──────────────────────────────────────────

export const studentSignup = async (data) => {
  const res = await apiClient.post("/api/auth/student/signup/", data);
  if (res && res.token) {
    setToken(res.token);
    setUser({ ...res.user, role: "student" });
  }
  return res;
};

export const studentLogin = async (data) => {
  const res = await apiClient.post("/api/auth/student/login/", data);
  if (res && res.token) {
    setToken(res.token);
    setUser({ ...res.user, role: "student" });
  }
  return res;
};

// ── Password Reset ────────────────────────────────────────

export const forgotPassword = async (email) => {
  return apiClient.post("/api/auth/forgot-password/", { email });
};

export const resetPassword = async (data) => {
  return apiClient.post("/api/auth/reset-password/", data);
};

// ── Logout ────────────────────────────────────────────────

export const logout = async () => {
  try {
    await apiClient.post("/api/auth/logout/", {});
  } catch (_) {
    // Silently ignore logout API errors
  } finally {
    removeToken();
    removeUser();
  }
};
