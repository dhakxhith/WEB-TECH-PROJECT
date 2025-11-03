// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ auth, requiredRole, children }) {
  if (!auth.isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && auth.role !== requiredRole) return <Navigate to="/login" />;
  return children;
}
