/**
 * settingsService.js — Real Backend API Client for System Settings
 */

import apiClient, { getToken } from "./apiClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const settingsService = {
  // Fetch all system settings + holidays from backend database
  getSettings: async () => {
    return await apiClient.get("/api/settings/");
  },

  // Save all settings to database
  updateSettings: async (settingsData) => {
    return await apiClient.put("/api/settings/", settingsData);
  },

  // Upload College Logo to backend media storage
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append("logo", file);
    return await apiClient.upload("/api/settings/logo/", formData);
  },

  // Dispatch real test email via SMTP
  sendTestEmail: async (emailConfig) => {
    return await apiClient.post("/api/settings/test-email/", emailConfig);
  },

  // Download real database backup (.sqlite3)
  downloadBackup: async () => {
    const token = getToken();
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}/api/settings/backup/`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to download database backup archive.");
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get("content-disposition");
    let filename = `sam_backup_${new Date().toISOString().slice(0, 10)}.sqlite3`;
    if (contentDisposition && contentDisposition.includes("filename=")) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    return true;
  },

  // Restore database from uploaded .sqlite3 file
  restoreBackup: async (file) => {
    const formData = new FormData();
    formData.append("backup_file", file);
    return await apiClient.upload("/api/settings/restore/", formData);
  },

  // Holiday Management
  getHolidays: async () => {
    return await apiClient.get("/api/settings/holidays/");
  },

  addHoliday: async (holidayData) => {
    return await apiClient.post("/api/settings/holidays/", holidayData);
  },

  deleteHoliday: async (id) => {
    return await apiClient.delete(`/api/settings/holidays/${id}/`);
  }
};

export default settingsService;
