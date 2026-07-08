import "../styles/Attendance.css";

function Attendance() {
  return (
    <div className="attendance-page">

      <div className="attendance-header">
        <h1>Attendance  Management</h1>

        <button>Save Attendance</button>
      </div>

      <table>

        <thead>

          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Class</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>

        </thead>

        <tbody>

          <tr>
            <td>101</td>
            <td>Rahul Sharma</td>
            <td>BCA-I</td>
            <td><input type="radio" name="101" /></td>
            <td><input type="radio" name="101" /></td>
          </tr>

          <tr>
            <td>102</td>
            <td>Priya Patil</td>
            <td>BCA-II</td>
            <td><input type="radio" name="102" /></td>
            <td><input type="radio" name="102" /></td>
          </tr>

          <tr>
            <td>103</td>
            <td>Amit Verma</td>
            <td>BCA-III</td>
            <td><input type="radio" name="103" /></td>
            <td><input type="radio" name="103" /></td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}

export default Attendance;