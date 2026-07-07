import "../styles/Students.css";

function Students() {
  return (
    <div className="students-page">

      <div className="students-header">
        <h1>Students Management</h1>

        <button>Add Student</button>
      </div>

      <table>

        <thead>

          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Class</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          <tr>
            <td>101</td>
            <td>Rahul Sharma</td>
            <td>BCA-I</td>
            <td>9876543210</td>

            <td>
              <button className="edit">Edit</button>

              <button className="delete">
                Delete
              </button>
            </td>

          </tr>

          <tr>
            <td>102</td>
            <td>Priya Patil</td>
            <td>BCA-II</td>
            <td>9876543201</td>

            <td>
              <button className="edit">Edit</button>

              <button className="delete">
                Delete
              </button>
            </td>

          </tr>

          <tr>
            <td>103</td>
            <td>Amit Verma</td>
            <td>BCA-III</td>
            <td>9876543202</td>

            <td>
              <button className="edit">Edit</button>

              <button className="delete">
                Delete
              </button>
            </td>

          </tr>

        </tbody>

      </table>

    </div>
  );
}

export default Students;