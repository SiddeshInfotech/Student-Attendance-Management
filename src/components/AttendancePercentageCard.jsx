import "../styles/AttendancePercentageCard.css";

const AttendancePercentageCard = () => {
  const student = JSON.parse(localStorage.getItem("currentStudent"));

  const attendance = student?.attendance || [];

  const totalClasses = attendance.length;

  const presentDays = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentDays = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const percentage =
    totalClasses === 0
      ? 0
      : ((presentDays / totalClasses) * 100).toFixed(1);

  return (
    <div className="attendance-card">

      <h2>Attendance Percentage</h2>

      <div className="circle">

        <h1>{percentage}%</h1>

      </div>

      <div className="progress">

        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>

      </div>

      <div className="attendance-details">

        <div className="detail">

          <h3>Total</h3>

          <p>{totalClasses}</p>

        </div>

        <div className="detail">

          <h3>Present</h3>

          <p>{presentDays}</p>

        </div>

        <div className="detail">

          <h3>Absent</h3>

          <p>{absentDays}</p>

        </div>

      </div>

    </div>
  );
};

export default AttendancePercentageCard;