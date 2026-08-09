import React, { createContext, useContext, useState, useEffect } from "react";
import {
  studentLogin as apiStudentLogin,
  studentSignup as apiStudentSignup,
  getStudentProfile as apiGetStudentProfile,
  updateStudentProfile as apiUpdateStudentProfile,
  changeStudentPassword as apiChangeStudentPassword,
  getStudentDashboard as apiGetStudentDashboard,
  logout as apiLogout
} from "../services/authService";
import { getToken, getUser } from "../services/apiClient";

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
  const [studentUser, setStudentUser] = useState(() => getUser());
  const [token, setToken] = useState(() => getToken());
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    if (!getToken()) return null;
    try {
      const data = await apiGetStudentProfile();
      setProfile(data);
      setStudentUser((prev) => ({ ...prev, ...data }));
      return data;
    } catch (err) {
      console.error("Failed to fetch student profile:", err);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await apiStudentLogin(credentials);
      setToken(getToken());
      setStudentUser(getUser());
      await fetchProfile();
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await apiStudentSignup(data);
      setToken(getToken());
      setStudentUser(getUser());
      await fetchProfile();
      return res;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await apiUpdateStudentProfile(data);
      await fetchProfile();
      return res;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data) => {
    return apiChangeStudentPassword(data);
  };

  const logout = async () => {
    await apiLogout();
    setToken(null);
    setStudentUser(null);
    setProfile(null);
  };

  return (
    <StudentAuthContext.Provider
      value={{
        studentUser,
        token,
        profile,
        loading,
        login,
        register,
        updateProfile,
        changePassword,
        logout,
        refreshProfile: fetchProfile
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = () => useContext(StudentAuthContext);
