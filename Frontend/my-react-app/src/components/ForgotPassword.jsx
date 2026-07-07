import "../styles/ForgotPassword.css";

function ForgotPassword({ goToLogin }) {
  return (
    <div className="forgot-container">
      <div className="forgot-card">

        <div className="logo">🎓</div>

        <h1 className="title">Student Attendance</h1>
        <h2 className="subtitle">Management System</h2>

        <h3 className="heading">Forgot Password</h3>

        <p className="info">
          Enter your registered email address to reset your password.
        </p>

        <input
          type="email"
          placeholder="Enter Registered Email"
          className="input-box"
        />

        <button className="reset-btn">
          Reset Password
        </button>

        <p className="bottom-text">
          Remember your password?

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

export default ForgotPassword;