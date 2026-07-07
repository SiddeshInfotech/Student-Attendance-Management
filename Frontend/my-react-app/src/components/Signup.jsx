import "../styles/Signup.css";

function Signup({ goToLogin }) {
  return (
    <div className="signup-container">
      <div className="signup-card">

        <div className="logo">🎓</div>

        <h1 className="title">Student Attendance</h1>
        <h2 className="subtitle">Management System</h2>

        <h3 className="heading">Admin Sign Up</h3>

        <input
          type="text"
          placeholder="Enter Full Name"
          className="input-box"
        />

        <input
          type="email"
          placeholder="Enter Email"
          className="input-box"
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="input-box"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="input-box"
        />

        <button className="signup-btn">
          Sign Up
        </button>

        <p className="bottom-text">
          Already have an account?

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToLogin();
            }}
          >
            {" "}Login
          </a>
        </p>

      </div>
    </div>
  );
}

export default Signup;