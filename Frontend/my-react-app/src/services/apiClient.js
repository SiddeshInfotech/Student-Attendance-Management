/**
 * apiClient.js — Centralized HTTP client
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// ── Token Helpers ─────────────────────────────────────────
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

export const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));
export const getUser = () => {
  try {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};
export const removeUser = () => localStorage.removeItem("user");

// ── Build Headers ─────────────────────────────────────────
const buildHeaders = (isFormData = false) => {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// ── Extract readable error message from any response ─────
const extractError = (data) => {
  if (!data) return "Something went wrong.";
  if (typeof data === "string") return data;
  // Django REST Framework formats
  if (data.detail) {
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) return data.detail.join(", ");
    return JSON.stringify(data.detail);
  }
  if (data.message) return data.message;
  if (data.error) {
    if (typeof data.error === "string") return data.error;
    if (data.error.detail) return String(data.error.detail);
  }
  // Return first field error found
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    if (Array.isArray(val)) return `${firstKey}: ${val.join(", ")}`;
    if (typeof val === "string") return `${firstKey}: ${val}`;
  }
  return "An error occurred. Please try again.";
};

// ── Response Handler ──────────────────────────────────────// 🔒 Response Handler 🔒
const handleResponse = async (response) => {
  let data = null;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try { data = await response.json(); } catch { data = null; }
  }

  if (!response.ok) {
    // ✅ Auto-clear expired/invalid token on 401
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    const message = extractError(data);
    throw new Error(message);
  }

  return data;
};

// ── Core Request Method ───────────────────────────────────
const request = async (endpoint, { method = "GET", body = null, isFormData = false, timeout = 15000 } = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = buildHeaders(isFormData);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const config = { method, headers, signal: controller.signal };
  if (body) config.body = isFormData ? body : JSON.stringify(body);

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);
    return await handleResponse(response);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Server request timed out. The backend server might be starting up. Please try again.");
    }
    if (err.name === "TypeError") {
      throw new Error("Cannot connect to server. Please ensure the backend is running.");
    }
    throw err;
  }
};

// ── Exported HTTP Methods ─────────────────────────────────
const apiClient = {
  get:    (endpoint)           => request(endpoint, { method: "GET" }),
  post:   (endpoint, body)     => request(endpoint, { method: "POST",   body }),
  put:    (endpoint, body)     => request(endpoint, { method: "PUT",    body }),
  patch:  (endpoint, body)     => request(endpoint, { method: "PATCH",  body }),
  delete: (endpoint)           => request(endpoint, { method: "DELETE" }),
  upload: (endpoint, formData) => request(endpoint, { method: "POST",   body: formData, isFormData: true }),
};

export default apiClient;
