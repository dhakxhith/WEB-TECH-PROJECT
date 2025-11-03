// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Demo credentials (you can modify or remove)
  const credentials = {
    admin: { email: "admin@skillsphere.com", password: "admin123" },
    user: { email: "user@skillsphere.com", password: "user123" },
    professor: { email: "professor@university.edu", password: "prof123" },
    student: { email: "student@college.edu", password: "student123" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate email format (just check '@')
    if (!email.includes("@")) {
      setError("Please enter a valid email address!");
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // If the email matches a predefined credential
    const userEntry = Object.entries(credentials).find(
      ([_, cred]) => cred.email === email
    );

    if (userEntry) {
      const [role, cred] = userEntry;
      if (password === cred.password) {
        onLogin(email, role);
        navigate(role === "admin" ? "/admin" : "/user");
      } else {
        setError("Invalid password! Please try again.");
      }
    } else {
      // If not predefined → allow new login as a general user
      onLogin(email, "user");
      navigate("/user");
    }

    setIsLoading(false);
  };

  return (
    <div className="modern-login-container">
      <div className="login-background">
        <div className="login-card">
          {/* Header Section */}
          <div className="login-header">
            <div className="logo">
              <span className="logo-icon">🎓</span>
              <h1>SkillSphere</h1>
            </div>
            <p className="login-subtitle">
              Welcome back! Sign in with any valid email address.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`login-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing in...
                </>
              ) : (
                "Sign In to SkillSphere"
              )}
            </button>
          </form>

          {/* Footer */}
          <footer className="login-footer">
            <p>SkillSphere © 2025 | Educational Learning Portal</p>
            <div className="security-notice">
              <span className="security-icon">🔒</span>
              <span>Secure login for all users</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
