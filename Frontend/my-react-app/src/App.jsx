import { useState, useEffect } from "react";

import Login          from "./components/Login";
import Signup         from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard      from "./components/Dashboard";
import StudentDashboard from "./components/StudentDashboard";
import Landing        from "./components/Landing";
import StudentLogin   from "./components/StudentLogin";
import StudentSignup  from "./components/StudentSignup";
import StudentForgotPassword from "./components/StudentForgotPassword";
import ResetPassword  from "./components/ResetPassword";
import StudentResetPassword from "./components/StudentResetPassword";

function App() {
  const [page, setPage] = useState("landing");
  const [resetToken, setResetToken] = useState(null);

  // Navigate to a new page and push to browser history
  const navigate = (newPage) => {
    window.history.pushState({ page: newPage }, "", "#" + newPage);
    setPage(newPage);
  };

  // Handle browser back/forward buttons + reset-password link from email
  useEffect(() => {
    // Parse hash to support: #reset-password?token=abc123
    const parseHash = (hash) => {
      const raw = hash.startsWith("#") ? hash.slice(1) : hash;
      const [pagePart, queryPart] = raw.split("?");
      const params = new URLSearchParams(queryPart || "");
      return { pagePart: pagePart || "landing", token: params.get("token") };
    };

    // Check initial URL for reset-password link (from email)
    const { pagePart, token } = parseHash(window.location.hash);
    if (pagePart === "reset-password" && token) {
      setResetToken(token);
      setPage("reset-password");
    } else if (pagePart === "student-reset-password" && token) {
      setResetToken(token);
      setPage("student-reset-password");
    } else {
      window.history.replaceState({ page: "landing" }, "", "#landing");
    }

    const handlePopState = (e) => {
      if (e.state && e.state.page) {
        setPage(e.state.page);
      } else {
        setPage("landing");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <>
      {page === "landing"               && <Landing              setPage={navigate} />}
      {page === "login"                 && <Login                setPage={navigate} />}
      {page === "signup"                && <Signup               setPage={navigate} />}
      {page === "forgot"                && <ForgotPassword       setPage={navigate} />}
      {page === "reset-password"        && <ResetPassword        setPage={navigate} token={resetToken} />}
      {page === "dashboard"             && <Dashboard            setPage={navigate} />}
      {page === "student-dashboard"     && <StudentDashboard     setPage={navigate} />}
      {page === "student-login"         && <StudentLogin         setPage={navigate} />}
      {page === "student-signup"        && <StudentSignup        setPage={navigate} />}
      {page === "student-forgot"        && <StudentForgotPassword setPage={navigate} />}
      {page === "student-reset-password" && <StudentResetPassword setPage={navigate} token={resetToken} />}
    </>
  );
}

export default App;