// src/components/Navbar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ auth, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
    navigate("/");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getUserDisplayName = () => {
  if (auth.user) {
    return auth.user.split('@')[0];
  }
  return auth.role === 'admin' ? 'Administrator' : 'Learner';
};


  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="logo-section">
          <span className="logo-icon">🎓</span>
          <h1>SkillSphere</h1>
        </div>
        
        {auth.isAuthenticated ? (
          <div className="user-welcome">
            <span className="greeting">
              {getGreeting()}, {getUserDisplayName()}!
            </span>
            <div className="user-menu-container">
              <div 
                className="user-badge"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-avatar">
                  {auth.role === 'admin' ? '👨‍💼' : '👤'}
                </span>
                <span>
                  {auth.role === 'admin' ? 'Admin Panel' : 'Intermediate 🌟'}
                </span>
                <span className="dropdown-arrow">▼</span>
              </div>
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  {/* <div className="dropdown-item">
                    <span className="dropdown-icon">👤</span>
                    <span>My Profile</span>
                  </div> */}
                  {/* <div className="dropdown-item">
                    <span className="dropdown-icon">⚙️</span>
                    <span>Settings</span>
                  </div> */}
                  {/* <div className="dropdown-divider"></div> */}
                  <div 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <span className="dropdown-icon">🚪</span>
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <button 
              className="secondary-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button 
              className="primary-btn"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}