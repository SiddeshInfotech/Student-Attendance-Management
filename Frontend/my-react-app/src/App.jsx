import { useState } from "react";

import Login          from "./components/Login";
import Signup         from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard      from "./components/Dashboard";

function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      {page === "login"     && <Login          setPage={setPage} />}
      {page === "signup"    && <Signup         setPage={setPage} />}
      {page === "forgot"    && <ForgotPassword setPage={setPage} />}
      {page === "dashboard" && <Dashboard      setPage={setPage} />}
    </>
  );
}

export default App;