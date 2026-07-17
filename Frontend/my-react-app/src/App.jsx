import { useState } from "react";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      {page === "login" && (
        <Login setPage={setPage} />
      )}

      {page === "signup" && (
        <Signup setPage={setPage} />
      )}
       
      {page === "forgot" && (
        <ForgotPassword setPage={setPage} />
      )}
      
    </>
  );
}

export default App;