/**
 * DatePicker.jsx
 * ─────────────────────────────────────────────────────────
 * Custom date picker with a large calendar popup (420px).
 * Drop-in replacement for <input type="date" />.
 *
 * Props:
 *   value      – "YYYY-MM-DD" string
 *   onChange   – (dateStr) => void
 *   max        – max date string (optional)
 *   min        – min date string (optional)
 *   placeholder– placeholder text (optional)
 * ─────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";
import "../../styles/DatePicker.css";

const DAYS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const pad = (n) => String(n).padStart(2, "0");

const toStr = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

const formatDisplay = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1].slice(0, 3)} ${y}`;
};

function DatePicker({ value, onChange, max, min, placeholder = "Select date" }) {
  const [open, setOpen]             = useState(false);
  const [viewYear, setViewYear]     = useState(0);
  const [viewMonth, setViewMonth]   = useState(0); // 1-based
  const wrapRef = useRef(null);

  // Init viewMonth/viewYear from value or today
  useEffect(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      setViewYear(y);
      setViewMonth(m);
    } else {
      const now = new Date();
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth() + 1);
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Calendar grid ─────────────────────────────────────
  const calendarDays = useMemo(() => {
    const firstDay  = new Date(viewYear, viewMonth - 1, 1);
    const lastDay   = new Date(viewYear, viewMonth, 0).getDate();
    let startDow    = firstDay.getDay(); // 0=Sun
    startDow = startDow === 0 ? 6 : startDow - 1; // Convert to Mon=0

    const cells = [];

    // Previous month's trailing days
    const prevMonthLastDay = new Date(viewYear, viewMonth - 1, 0).getDate();
    for (let i = startDow - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const m   = viewMonth === 1 ? 12 : viewMonth - 1;
      const y   = viewMonth === 1 ? viewYear - 1 : viewYear;
      cells.push({ day, dateStr: toStr(y, m, day), isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= lastDay; d++) {
      cells.push({ day: d, dateStr: toStr(viewYear, viewMonth, d), isCurrentMonth: true });
    }

    // Next month's leading days to fill 6 rows (42 cells)
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const m = viewMonth === 12 ? 1 : viewMonth + 1;
      const y = viewMonth === 12 ? viewYear + 1 : viewYear;
      cells.push({ day: d, dateStr: toStr(y, m, d), isCurrentMonth: false });
    }

    return cells;
  }, [viewYear, viewMonth]);

  // ── Nav handlers ──────────────────────────────────────
  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // ── Select date ───────────────────────────────────────
  const selectDate = (dateStr) => {
    onChange(dateStr);
    setOpen(false);
  };

  // ── Is date disabled? ─────────────────────────────────
  const isDisabled = (dateStr) => {
    if (max && dateStr > max) return true;
    if (min && dateStr < min) return true;
    return false;
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="dp-wrapper" ref={wrapRef}>
      {/* Trigger input */}
      <button
        type="button"
        className="dp-trigger"
        onClick={() => setOpen(!open)}
      >
        <FaCalendarAlt className="dp-trigger-icon" />
        <span className={`dp-trigger-text ${!value ? "dp-placeholder" : ""}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <svg className="dp-trigger-chevron" width="12" height="12" viewBox="0 0 12 12">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {/* Calendar popup */}
      {open && (
        <div className="dp-popup">
          {/* Header */}
          <div className="dp-header">
            <button type="button" className="dp-nav-btn" onClick={prevMonth}>
              <FaChevronLeft />
            </button>
            <div className="dp-header-title">
              <span className="dp-month-name">{MONTHS[viewMonth - 1]}</span>
              <span className="dp-year">{viewYear}</span>
            </div>
            <button type="button" className="dp-nav-btn" onClick={nextMonth}>
              <FaChevronRight />
            </button>
          </div>

          {/* Day labels */}
          <div className="dp-day-labels">
            {DAYS.map((d) => (
              <div key={d} className="dp-day-label">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="dp-grid">
            {calendarDays.map((cell, i) => {
              const isSelected = value === cell.dateStr;
              const isToday    = cell.dateStr === today;
              const disabled   = isDisabled(cell.dateStr);

              return (
                <button
                  key={i}
                  type="button"
                  className={[
                    "dp-cell",
                    !cell.isCurrentMonth && "dp-cell-outside",
                    isSelected && "dp-cell-selected",
                    isToday && !isSelected && "dp-cell-today",
                    disabled && "dp-cell-disabled",
                  ].filter(Boolean).join(" ")}
                  disabled={disabled}
                  onClick={() => !disabled && selectDate(cell.dateStr)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="dp-footer">
            <button
              type="button"
              className="dp-today-btn"
              onClick={() => {
                const now = new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth() + 1);
                if (!isDisabled(today)) selectDate(today);
              }}
            >
              Today
            </button>
            {value && (
              <span className="dp-footer-value">
                Selected: {formatDisplay(value)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
