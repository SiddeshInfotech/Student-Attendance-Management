import "../styles/DownloadReportButton.css";

const DownloadReportButton = () => {
  const downloadReport = () => {
    const student = JSON.parse(localStorage.getItem("currentStudent"));

    if (!student) {
      alert("No student logged in!");
      return;
    }

    const attendance = student.attendance || [];

    const total = attendance.length;
    const present = attendance.filter(
      (item) => item.status === "Present"
    ).length;
    const absent = attendance.filter(
      (item) => item.status === "Absent"
    ).length;

    const percentage =
      total === 0
        ? 0
        : ((present / total) * 100).toFixed(2);

    let report = `
========================================
 STUDENT ATTENDANCE REPORT
========================================

Student Name : ${student.fullName}
Roll Number  : ${student.rollNo}
Class        : ${student.className}
Email        : ${student.email}

----------------------------------------
Attendance Summary
----------------------------------------

Total Classes : ${total}
Present       : ${present}
Absent        : ${absent}
Percentage    : ${percentage}%

----------------------------------------
Attendance Records
----------------------------------------
`;

    attendance.forEach((item, index) => {
      report += `
${index + 1}.
Date    : ${item.date}
Subject : ${item.subject}
Status  : ${item.status}
----------------------------------------
`;
    });

    const blob = new Blob([report], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${student.fullName}_Attendance_Report.txt`;

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="download-btn"
      onClick={downloadReport}
    >
      Download Attendance Report
    </button>
  );
};

export default DownloadReportButton;