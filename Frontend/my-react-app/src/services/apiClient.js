/**
 * apiClient.js
 * ─────────────────────────────────────────────────────────
 * Centralized HTTP client for all API communication.
 *
 * Features:
 *  - Base URL from .env (VITE_API_BASE_URL)
 *  - Automatic Authorization header injection (Bearer JWT)
 *  - JSON Content-Type by default
 *  - Unified error handling with readable error messages
 *  - FormData support (for file uploads)
 *  - Redirect to login on 401 Unauthorized
 * ─────────────────────────────────────────────────────────
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// ── Response Handler ──────────────────────────────────────
const handleResponse = async (response) => {
  // 401 → clear credentials, redirect to login
  if (response.status === 401) {
    removeToken();
    removeUser();
    window.location.href = "/";
    throw new Error("Session expired. Please log in again.");
  }

  // Try to parse JSON body
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    // Non-JSON response (e.g. file download)
    return response;
  }

  if (!response.ok) {
    // Extract backend error message if available
    const message =
      data?.message || data?.error || data?.detail || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return data;
};

// ── Core Request Method ───────────────────────────────────
const request = async (endpoint, { method = "GET", body = null, isFormData = false } = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = buildHeaders(isFormData);

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (err) {
    // Network error (no server response)
    if (err.name === "TypeError") {
      throw new Error("Unable to reach server. Please check your connection.");
    }
    throw err;
  }
};

// ── Exported HTTP Methods ─────────────────────────────────
const apiClient = {
  get:    (endpoint)              => request(endpoint, { method: "GET" }),
  post:   (endpoint, body)        => request(endpoint, { method: "POST",   body }),
  put:    (endpoint, body)        => request(endpoint, { method: "PUT",    body }),
  patch:  (endpoint, body)        => request(endpoint, { method: "PATCH",  body }),
  delete: (endpoint)              => request(endpoint, { method: "DELETE" }),
  upload: (endpoint, formData)    => request(endpoint, { method: "POST",   body: formData, isFormData: true }),
};

export default apiClient;
