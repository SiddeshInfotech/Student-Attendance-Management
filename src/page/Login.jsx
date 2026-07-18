import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("rememberStudent"));

    if (saved) {
      setUsername(saved.username);
      setPassword(saved.password);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const students = JSON.parse(localStorage.getItem("students")) || [];

    const student = students.find(
      (item) =>
        item.username === username &&
        item.password === password
    );

    if (!student) {
      alert("Invalid Username or Password");
      return;
    }

    localStorage.setItem(
      "currentStudent",
      JSON.stringify(student)
    );

    if (rememberMe) {
      localStorage.setItem(
        "rememberStudent",
        JSON.stringify({
          username,
          password,
        })
      );
    } else {
      localStorage.removeItem("rememberStudent");
    }

    alert("Login Successful");

    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      <div className="overlay">

        <div className="left-section">

          <FaUserGraduate className="graduate-icon"/>

          <h1>
            Student Attendance
          </h1>

          <h2>
            Management System
          </h2>

          <p>
            Track Attendance Easily
          </p>

        </div>

        <div className="login-card">

          <h2>
            Student Login
          </h2>

          <form onSubmit={handleLogin}>

            <div className="input-box">

              <FaUser className="input-icon"/>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                required
              />

            </div>

            <div className="input-box">

              <FaLock className="input-icon"/>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

              <span
                className="eye"
                onClick={()=>
                  setShowPassword(!showPassword)
                }
              >
                {
                  showPassword
                  ? <FaEyeSlash/>
                  : <FaEye/>
                }
              </span>

            </div>

            <div className="remember">

              <label>

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e)=>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                />

                Remember Me

              </label>

              <Link to="/forgot-password">
                Forgot Password?
              </Link>

            </div>

            <button
              className="login-btn"
            >
              Login
            </button>

            <div className="register-link">

              New Student?

              <Link to="/register">
                Register
              </Link>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;