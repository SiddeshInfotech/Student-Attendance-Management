import { useState } from "react";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";

function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      {/* Login */}
      {page === "login" && (
        <Login
          goToSignup={() => setPage("signup")}
          goToForgot={() => setPage("forgot")}
          goToDashboard={() => setPage("dashboard")}
        />
      )}

      {/* Signup */}
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

      {/* Dashboard (Main Application) */}
      {page === "dashboard" && (
        <Dashboard
          logout={() => setPage("login")}
        />
      )}
    </>
  );
}

export default App;