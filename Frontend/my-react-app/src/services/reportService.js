/**
 * reportService.js
 * ─────────────────────────────────────────────────────────
 * Handles Report generation and downloads:
 *   GET /api/reports/monthly
 *   GET /api/reports/export (CSV/PDF)
 * ─────────────────────────────────────────────────────────
 */

import apiClient from "./apiClient.js";

/**
 * Fetch monthly attendance report data
 * @param {string} month - "YYYY-MM"
 * @returns {Promise<Array>}
 */
export const getMonthlyReport = (month) =>
  apiClient.get(`/api/reports/monthly?month=${month}`);

/**
 * Export report as file (CSV or PDF)
 * This uses a standard fetch to handle the Blob response correctly.
 * @param {string} format - "csv" or "pdf"
 * @param {string} dateRange - "YYYY-MM-DD,YYYY-MM-DD"
 */
export const exportReport = async (format = "csv", dateRange = "") => {
  const token = localStorage.getItem("token");
  let url = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/reports/export?format=${format}`;
  if (dateRange) url += `&dateRange=${dateRange}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to export report");
  }

  // Create a blob and trigger download
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `attendance_report_${new Date().toISOString().split("T")[0]}.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
};
