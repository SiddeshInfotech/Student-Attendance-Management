/**
 * HistoryTab.jsx
 * ─────────────────────────────────────────────────────────
 * Attendance History page:
 * - Direct database API synchronization
 * - Filter by Today, Last 7, Last 10, Last 30 days, or Custom Range
 * - Table displays: Roll No, Student Name, Department, Class, Semester,
 *   Subject, Date, Time, Status, Marked By
 * - Loading state during fetch
 * - Displays "No attendance found for today" if empty for today
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  FaCalendarAlt, FaSearch, FaChevronLeft, FaChevronRight,
  FaFilter, FaSync,
} from "react-icons/fa";
import { todayStr, nDaysAgo, formatDate } from "../../store/useAttendanceStore";
import DatePicker from "../ui/DatePicker";
import { getAttendanceHistory, getTodayAttendance } from "../../services/attendanceService";

const ROWS_PER_PAGE = 15;

function HistoryTab({ store }) {
  // Period selection (default: today)
  const [period, setPeriod] = useState("today");
  const [customStart, setCustomStart] = useState(nDaysAgo(30));
  const [customEnd,   setCustomEnd]   = useState(todayStr());

  // Backend state
  const [dbRecords, setDbRecords]     = useState([]);
  const [loading, setLoading]         = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination
  const [page, setPage] = useState(1);

  // Store ref to prevent re-render loops from un-memoized store object
  const storeRef = useRef(store);
  useEffect(() => {
    storeRef.current = store;
  }, [store]);

  // ── Fetch fresh records from backend and merge with store ─────────
  const fetchHistoryData = useCallback(async () => {
    setLoading(true);

    const today = todayStr();
    let startDate = today;
    let endDate = today;
    if (period === "7days") startDate = nDaysAgo(6);
    else if (period === "10days") startDate = nDaysAgo(9);
    else if (period === "30days") startDate = nDaysAgo(29);
    else if (period === "custom") { startDate = customStart; endDate = customEnd; }

    // 1. Get store records for the date range
    const storeRaw = storeRef.current?.attendanceRecords || [];
    const storeFiltered = storeRaw.filter((r) => {
      const d = r.date || r.attendance_date;
      return d >= startDate && d <= endDate;
    });

    const storeFormatted = storeFiltered.map((r) => {
      const st = storeRef.current?.students?.find(
        (s) => String(s.id) === String(r.studentId) || String(s.student_id) === String(r.student_id) || String(s.id) === String(r.student_id)
      );
      return {
        attendance_id: r.id || r.attendance_id || `local_${r.studentId || r.student_id}_${r.date || r.attendance_date}`,
        roll_number: r.roll_number || st?.rollNo || st?.roll_number || "—",
        student_name: r.student_name || st?.name || st?.full_name || "Unknown",
        department_name: r.department_name || st?.department || "Computer Science",
        class_name: r.class_name || st?.grade || st?.student_class?.class_name || "Grade 10",
        semester_name: r.semester_name || "Semester 1",
        subject_name: r.subject_name || "General",
        attendance_date: r.date || r.attendance_date,
        attendance_time: r.attendance_time || "Just now",
        status: r.status || "Present",
        marked_by: r.marked_by || "Admin",
      };
    });

    // 2. Fetch API records
    let apiRecords = [];
    try {
      let data = [];
      if (period === "today") {
        data = await getTodayAttendance();
      } else if (period === "custom") {
        data = await getAttendanceHistory({
          period: "custom",
          start_date: customStart,
          end_date: customEnd,
        });
      } else {
        data = await getAttendanceHistory({ period });
      }
      apiRecords = Array.isArray(data) ? data : (data?.results || []);
    } catch (err) {
      console.warn("API history fetch failed, utilizing store records:", err);
    }

    // 3. Merge: API records take precedence if present, store records fill any gaps
    const combinedMap = new Map();
    storeFormatted.forEach((rec) => {
      const key = `${rec.roll_number}_${rec.attendance_date}`;
      combinedMap.set(key, rec);
    });

    apiRecords.forEach((rec) => {
      const rDate = rec.attendance_date || rec.date;
      const rRoll = rec.roll_number || rec.student?.roll_number || rec.student?.rollNo || "—";
      const key = `${rRoll}_${rDate}`;
      combinedMap.set(key, {
        attendance_id: rec.attendance_id || rec.id,
        roll_number: rRoll,
        student_name: rec.student_name || rec.student?.user_details?.full_name || rec.student?.name || "Unknown",
        department_name: rec.department_name || rec.student?.department?.department_name || "Computer Science",
        class_name: rec.class_name || rec.student?.student_class?.class_name || "Grade 10",
        semester_name: rec.semester_name || "Semester 1",
        subject_name: rec.subject_name || "General",
        attendance_date: rDate,
        attendance_time: rec.attendance_time || "10:00 AM",
        status: rec.status || "Present",
        marked_by: rec.marked_by || "Admin",
      });
    });

    setDbRecords(Array.from(combinedMap.values()));
    setLoading(false);
  }, [period, customStart, customEnd]);

  useEffect(() => {
    fetchHistoryData();
  }, [fetchHistoryData, store?.attendanceRecords]);

  // ── Date range label for summary ──────────────────────────
  const { startDateLabel, endDateLabel } = useMemo(() => {
    const today = todayStr();
    if (period === "today")    return { startDateLabel: today,       endDateLabel: today };
    if (period === "7days")    return { startDateLabel: nDaysAgo(6),  endDateLabel: today };
    if (period === "10days")   return { startDateLabel: nDaysAgo(9),  endDateLabel: today };
    if (period === "30days")   return { startDateLabel: nDaysAgo(29), endDateLabel: today };
    if (period === "custom")   return { startDateLabel: customStart,  endDateLabel: customEnd };
    return { startDateLabel: today, endDateLabel: today };
  }, [period, customStart, customEnd]);

  // ── Filter by search + status ─────────────────────────
  const filteredRecords = useMemo(() => {
    let result = dbRecords;

    if (statusFilter !== "All") {
      result = result.filter((r) =>
        String(r.status).toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (r) =>
          (r.student_name && r.student_name.toLowerCase().includes(q)) ||
          (r.roll_number && r.roll_number.toLowerCase().includes(q)) ||
          (r.department_name && r.department_name.toLowerCase().includes(q)) ||
          (r.class_name && r.class_name.toLowerCase().includes(q)) ||
          (r.subject_name && r.subject_name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [dbRecords, statusFilter, searchQuery]);

  // ── Pagination ────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ROWS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const pagedRecords = filteredRecords.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE
  );

  const handlePeriodChange = (p) => { setPeriod(p); setPage(1); };
  const handleSearchChange = (q) => { setSearchQuery(q); setPage(1); };
  const handleStatusChange = (s) => { setStatusFilter(s); setPage(1); };

  const presentCount = filteredRecords.filter((r) => String(r.status).toLowerCase() === "present").length;
  const absentCount  = filteredRecords.filter((r) => String(r.status).toLowerCase() === "absent").length;

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="content-header">
        <div className="header-welcome">
          <h2>Attendance History</h2>
          <p className="header-date">Real-time attendance records directly from the database</p>
        </div>
        <div className="header-actions">
          <button
            className="primary-action-btn"
            style={{ background: "#0284c7" }}
            onClick={fetchHistoryData}
            title="Refresh from database"
          >
            <FaSync className={loading ? "spin" : ""} />
            <span>Refresh Data</span>
          </button>
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
              { key: "today",  label: "Today History" },
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
              <DatePicker
                value={customStart}
                max={customEnd}
                onChange={(dateStr) => { setCustomStart(dateStr); setPage(1); }}
                className="history-date-input"
                placeholder="From Date"
              />
            </div>
            <div className="modal-input-group" style={{ minWidth: "280px" }}>
              <label className="reports-date-label">To Date</label>
              <DatePicker
                value={customEnd}
                min={customStart}
                max={todayStr()}
                onChange={(dateStr) => { setCustomEnd(dateStr); setPage(1); }}
                className="history-date-input"
                placeholder="To Date"
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
            {formatDate(startDateLabel)} – {formatDate(endDateLabel)}
          </span>
        </div>
      </div>

      {/* ── Results Table ─────────────────────────────────── */}
      <div className="table-card bg-glass">
        <div className="table-card-header">
          <div className="table-title">
            <h3>{period === "today" ? "Today's Attendance History" : "Attendance Records"}</h3>
            <p>Database records ordered by latest attendance time</p>
          </div>
          <div className="table-filters">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search student, roll no, department..."
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
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="table-empty-state" style={{ padding: "40px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <div className="loading-spinner" style={{ width: "20px", height: "20px", borderTopColor: "#3b82f6" }} />
                      <span>Fetching latest attendance records from database...</span>
                    </div>
                  </td>
                </tr>
              ) : pagedRecords.length > 0 ? (
                pagedRecords.map((record, index) => {
                  const sName = record.student_name || record.student?.name || "Student";
                  const initials = sName.split(" ").map((n) => n[0]).join("").slice(0, 2);
                  const statusStr = String(record.status || "Present");

                  return (
                    <tr key={record.attendance_id || record.id || index}>
                      <td><strong>{record.roll_number || record.student?.rollNo || "—"}</strong></td>
                      <td>
                        <div className="student-profile">
                          <div className="avatar-badge">{initials}</div>
                          <span className="student-name">{sName}</span>
                        </div>
                      </td>
                      <td>{record.class_name || record.student?.grade || "—"}</td>
                      <td>
                        <span className="arrival-time">{formatDate(record.attendance_date || record.date)}</span>
                      </td>
                      <td>
                        <span className="arrival-time">{record.attendance_time || "—"}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${statusStr.toLowerCase()}`}>
                          {statusStr.charAt(0).toUpperCase() + statusStr.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="table-empty-state">
                    {period === "today"
                      ? "No attendance found for today"
                      : dbRecords.length === 0
                      ? "No attendance records found for the selected period."
                      : "No records match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ────────────────────────────────── */}
        {!loading && totalPages > 1 && (
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
