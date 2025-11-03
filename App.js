// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseDetail from "./components/CourseDetails";
import "./styles.css";

export default function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: "",
    role: "",
  });

  // ✅ Handle user login
  const handleLogin = (email, role) => {
    setAuth({
      isAuthenticated: true,
      user: email,
      role,
    });
  };

  // ✅ Handle user logout
  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      user: "",
      role: "",
    });
  };

  return (
    <Router>
      {/* Navbar visible on all pages */}
      <Navbar auth={auth} onLogout={handleLogout} />

      <div className="container mt-4">
        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Protected Route for Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="admin"
                redirectPath="/login"
              >
                <AdminDashboard user={auth.user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* ✅ Protected Route for User */}
          <Route
            path="/user"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="user"
                redirectPath="/login"
              >
                <UserDashboard user={auth.user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* ✅ Course Details Route (User Only) */}
          <Route
            path="/course/:courseId"
            element={
              <ProtectedRoute
                auth={auth}
                requiredRole="user"
                redirectPath="/login"
              >
                <CourseDetail />
              </ProtectedRoute>
            }
          />

          {/* ✅ Default Fallback Route */}
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
}
