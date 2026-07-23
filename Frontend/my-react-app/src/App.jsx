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

function App() {
  const [page, setPage] = useState("landing");

  // Navigate to a new page and push to browser history
  const navigate = (newPage) => {
    window.history.pushState({ page: newPage }, "", "#" + newPage);
    setPage(newPage);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    // Set initial history state
    window.history.replaceState({ page: "landing" }, "", "#landing");

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
      {page === "landing"        && <Landing              setPage={navigate} />}
      {page === "login"          && <Login                setPage={navigate} />}
      {page === "signup"         && <Signup               setPage={navigate} />}
      {page === "forgot"         && <ForgotPassword       setPage={navigate} />}
      {page === "dashboard"      && <Dashboard            setPage={navigate} />}
      {page === "student-dashboard" && <StudentDashboard  setPage={navigate} />}
      {page === "student-login"  && <StudentLogin         setPage={navigate} />}
      {page === "student-signup" && <StudentSignup        setPage={navigate} />}
      {page === "student-forgot" && <StudentForgotPassword setPage={navigate} />}
    </>
  );
}

export default App;