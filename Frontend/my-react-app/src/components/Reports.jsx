import "../styles/Reports.css";

function Reports() {
  return (
    <div className="reports-page">

      <div className="reports-header">
        <h1>Attendance Reports</h1>

        <button>Download Report</button>
      </div>

      <div className="report-cards">

        <div className="report-card">
          <h3>Total Students</h3>
          <h1>250</h1>
        </div>

        <div className="report-card">
          <h3>Present</h3>
          <h1>220</h1>
        </div>

        <div className="report-card">
          <h3>Absent</h3>
          <h1>30</h1>
        </div>

      </div>

    </div>
  );
}

export default Reports;