import { useState } from "react";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Attendance from "./components/Attendance";
import Reports from "./components/Reports";
import Settings from "./components/Settings";

function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      {/* Login Page */}
      {page === "login" && (
        <Login
          goToSignup={() => setPage("signup")}
          goToForgot={() => setPage("forgot")}
          goToDashboard={() => setPage("dashboard")}
        />
      )}

      {/* Signup Page */}
      {page === "signup" && (
        <Signup
          goToLogin={() => setPage("login")}
        />
      )}

      {/* Forgot Password */}
      {page === "forgot" && (
        <ForgotPassword
          goToLogin={() => setPage("login")}
        />
      )}

      {/* Dashboard */}
      {page === "dashboard" && (
        <Dashboard
          logout={() => setPage("login")}
          goToStudents={() => setPage("students")}
          goToAttendance={() => setPage("attendance")}
          goToReports={() => setPage("reports")}
          goToSettings={() => setPage("settings")}
      />
     )}

      {/* Students */}
      {page === "students" && (
        <Students />
      )}
      {/* Attendance */}
      {page === "attendance" && (
        <Attendance />
      )}
      {/* Reports */}
      {page === "reports" && (
        <Reports />
      )}
      {/* Settings */}
      {page === "settings" && (
        <Settings />
      )}  
    </>
  );
}

export default App;