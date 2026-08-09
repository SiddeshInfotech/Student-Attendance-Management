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

// ── Student Auth & APIs ───────────────────────────────────

export const studentSignup = async (data) => {
  const res = await apiClient.post("/api/student/register/", data);
  if (res && res.token) {
    setToken(res.token);
    const studentUser = {
      ...(res.user || {}),
      ...(res.student || res.profile || {}),
      role: "student"
    };
    setUser(studentUser);
  }
  return res;
};

export const studentLogin = async (data) => {
  const res = await apiClient.post("/api/student/login/", data);
  if (res && res.token) {
    setToken(res.token);
    const studentUser = {
      ...(res.user || {}),
      ...(res.student || res.profile || {}),
      role: "student"
    };
    setUser(studentUser);
  }
  return res;
};

export const getStudentProfile = async () => {
  return apiClient.get("/api/student/profile/");
};

export const updateStudentProfile = async (data) => {
  const res = await apiClient.put("/api/student/profile/update/", data);
  if (res && (res.student || res.profile)) {
    const updated = res.student || res.profile;
    setUser({ ...updated, role: "student" });
  }
  return res;
};

export const changeStudentPassword = async (data) => {
  return apiClient.post("/api/student/change-password/", data);
};

export const getStudentDashboard = async () => {
  return apiClient.get("/api/student/dashboard/");
};

export const getStudentDailyAttendance = async () => {
  return apiClient.get("/api/student/attendance/daily/");
};

export const getStudentWeeklyAttendance = async () => {
  return apiClient.get("/api/student/attendance/weekly/");
};

export const getStudentMonthlyAttendance = async () => {
  return apiClient.get("/api/student/attendance/monthly/");
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
