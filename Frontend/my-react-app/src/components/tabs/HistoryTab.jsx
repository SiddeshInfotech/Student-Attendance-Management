/**
 * HistoryTab.jsx
 * ─────────────────────────────────────────────────────────
 * Attendance History page:
 * - Quick filter: Today / Last 7 / Last 10 / Last 30 days
 * - Custom date range picker
 * - Results table: Roll No, Name, Class, Date, Status
 * - Sorted by latest date first
 * - Pagination (15 records/page)
 * - Search within results
 * ─────────────────────────────────────────────────────────
 */

import { useState, useMemo } from "react";
import {
  FaCalendarAlt, FaSearch, FaChevronLeft, FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import { todayStr, nDaysAgo, formatDate } from "../../store/useAttendanceStore";

const ROWS_PER_PAGE = 15;

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function HistoryTab({ store }) {
  const { getAttendanceByRange } = store;

  // Period selection
  const [period, setPeriod] = useState("7days");
  const [customStart, setCustomStart] = useState(nDaysAgo(30));
  const [customEnd,   setCustomEnd]   = useState(todayStr());

  // Search within results
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  // Status filter
  const [statusFilter, setStatusFilter] = useState("All");

  // ── Compute date range ────────────────────────────────
  const { startDate, endDate } = useMemo(() => {
    const today = todayStr();
    if (period === "today")    return { startDate: today,       endDate: today };
    if (period === "7days")    return { startDate: nDaysAgo(6),  endDate: today };
    if (period === "10days")   return { startDate: nDaysAgo(9),  endDate: today };
    if (period === "30days")   return { startDate: nDaysAgo(29), endDate: today };
    if (period === "custom")   return { startDate: customStart,  endDate: customEnd };
    return { startDate: today, endDate: today };
  }, [period, customStart, customEnd]);

  // ── Get records ───────────────────────────────────────
  const allRecords = useMemo(
    () => getAttendanceByRange(startDate, endDate),
    [getAttendanceByRange, startDate, endDate]
  );

  // ── Filter by search + status ─────────────────────────
  const filteredRecords = useMemo(() => {
    let result = allRecords;
    if (statusFilter !== "All") {
      result = result.filter((r) => r.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.student?.name.toLowerCase().includes(q) ||
          r.student?.rollNo.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allRecords, statusFilter, searchQuery]);

  // ── Pagination ────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ROWS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pagedRecords = filteredRecords.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE
  );

  // Reset to page 1 on filter change
  const handlePeriodChange = (p) => { setPeriod(p); setPage(1); };
  const handleSearchChange = (q) => { setSearchQuery(q); setPage(1); };
  const handleStatusChange = (s) => { setStatusFilter(s); setPage(1); };

  const presentCount = filteredRecords.filter((r) => r.status === "Present").length;
  const absentCount  = filteredRecords.filter((r) => r.status === "Absent").length;

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="content-header">
        <div className="header-welcome">
          <h2>Attendance History</h2>
          <p className="header-date">View and filter attendance records by date range</p>
        </div>
      </header>

      {/* ── Quick Period Filters ──────────────────────────── */}
      <div className="bg-glass history-filter-card">
        <div className="history-period-row">
          <span className="history-filter-label">
            <FaFilter style={{ marginRight: "6px", color: "#3b82f6" }} />
            Period:
          </span>
          <div className="filter-badge-row" style={{ flexWrap: "wrap" }}>
            {[
              { key: "today",  label: "Today" },
              { key: "7days",  label: "Last 7 Days" },
              { key: "10days", label: "Last 10 Days" },
              { key: "30days", label: "Last 30 Days" },
              { key: "custom", label: "Custom Range" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`filter-badge-btn ${period === key ? "active" : ""}`}
                onClick={() => handlePeriodChange(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date range */}
        {period === "custom" && (
          <div className="history-custom-range">
            <div className="modal-input-group" style={{ minWidth: "280px" }}>
              <label className="reports-date-label">From Date</label>
              <input
                type="date"
                value={customStart}
                max={customEnd}
                onChange={(e) => { setCustomStart(e.target.value); setPage(1); }}
                className="history-date-input"
              />
            </div>
            <div className="modal-input-group" style={{ minWidth: "280px" }}>
              <label className="reports-date-label">To Date</label>
              <input
                type="date"
                value={customEnd}
                min={customStart}
                max={todayStr()}
                onChange={(e) => { setCustomEnd(e.target.value); setPage(1); }}
                className="history-date-input"
              />
            </div>
          </div>
        )}

        {/* Summary pills */}
        <div className="history-summary-pills">
          <span className="history-summary-pill pill-total">{filteredRecords.length} Records</span>
          <span className="history-summary-pill pill-present">{presentCount} Present</span>
          <span className="history-summary-pill pill-absent">{absentCount} Absent</span>
          <span className="history-summary-pill pill-range">
            <FaCalendarAlt style={{ marginRight: "4px" }} />
            {formatDate(startDate)} – {formatDate(endDate)}
          </span>
        </div>
      </div>

      {/* ── Results Table ─────────────────────────────────── */}
      <div className="table-card bg-glass">
        <div className="table-card-header">
          <div className="table-title">
            <h3>Attendance Records</h3>
            <p>Sorted by latest date first</p>
          </div>
          <div className="table-filters">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search student or roll no..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="filter-badge-row">
              {["All", "Present", "Absent"].map((s) => (
                <button
                  key={s}
                  className={`filter-badge-btn ${statusFilter === s ? "active" : ""}`}
                  onClick={() => handleStatusChange(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Division</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pagedRecords.length > 0 ? (
                pagedRecords.map((record) => (
                  <tr key={record.id}>
                    <td><strong>{record.student?.rollNo ?? "—"}</strong></td>
                    <td>
                      <div className="student-profile">
                        <div className="avatar-badge">
                          {record.student?.name.split(" ").map((n) => n[0]).join("").slice(0, 2) ?? "?"}
                        </div>
                        <span className="student-name">{record.student?.name ?? "Unknown"}</span>
                      </div>
                    </td>
                    <td>{record.student?.grade ?? "—"}</td>
                    <td><span className="division-badge">{record.student?.division ?? "—"}</span></td>
                    <td>
                      <span className="arrival-time">{formatDate(record.date)}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="table-empty-state">
                    {allRecords.length === 0
                      ? "No attendance records found for the selected period."
                      : "No records match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="pagination-row">
            <span className="pagination-info">
              Page {safePage} of {totalPages} &nbsp;·&nbsp; {filteredRecords.length} records
            </span>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <FaChevronLeft />
              </button>
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
                const pageNum = start + i;
                return (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${safePage === pageNum ? "active" : ""}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="pagination-btn"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HistoryTab;
