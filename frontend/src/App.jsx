import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./page/Login";
import Register from "./page/Register";
import ForgotPassword from "./page/ForgotPassword";

import Dashboard from "./page/Dashboard";
import MyProfile from "./page/MyProfile";
import MyAttendance from "./page/MyAttendance";
import AttendanceHistory from "./page/AttendanceHistory";
import ChangePassword from "./page/ChangePassword";

import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/App.css";


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
          element={<Register />}
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
