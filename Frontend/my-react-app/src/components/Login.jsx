import "../styles/Login.css";

function Login({ goToSignup, goToForgot, goToDashboard }) {
  return (
    <div className="login-container">
      <div className="login-card">

        <div className="logo">🎓</div>

        <h1 className="title">Student Attendance</h1>
        <h2 className="subtitle">Management System</h2>

        <h3 className="heading">Admin Login</h3>

        <input
          type="email"
          placeholder="Enter Email"
        />

        <input
          type="password"
          placeholder="Enter Password"
        />

        <div className="options">
          <label className="remember">
            <input type="checkbox" />
            <span>Remember Me</span>
          </label>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToForgot();
            }}
          >
            Forgot Password?
          </a>
        </div>

        <button
          className="login-btn"
          onClick={goToDashboard}
        >
          Login
        </button>

        <p className="signup-text">
          Don't have an account?
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goToSignup();
            }}
          >
            {" "}Sign Up
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login;