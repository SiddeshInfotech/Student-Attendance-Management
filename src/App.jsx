import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import MyAttendance from "./pages/MyAttendance";
import AttendanceHistory from "./pages/AttendanceHistory";
import ChangePassword from "./pages/ChangePassword";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";


function App() {


  return (

    <BrowserRouter>

      <Routes>


        {/* Public Pages */}

        <Route
          path="/"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Registration />}
        />


        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />



        {/* Protected Pages */}


        <Route

          path="/dashboard"

          element={

            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>

          }

        />



        <Route

          path="/profile"

          element={

            <ProtectedRoute>

              <MyProfile />

            </ProtectedRoute>

          }

        />



        <Route

          path="/attendance"

          element={

            <ProtectedRoute>

              <MyAttendance />

            </ProtectedRoute>

          }

        />



        <Route

          path="/attendance-history"

          element={

            <ProtectedRoute>

              <AttendanceHistory />

            </ProtectedRoute>

          }

        />



        <Route

          path="/change-password"

          element={

            <ProtectedRoute>

              <ChangePassword />

            </ProtectedRoute>

          }

        />



        {/* Default Route */}

        <Route

          path="*"

          element={<Login />}

        />


      </Routes>


    </BrowserRouter>

  );

}


export default App;