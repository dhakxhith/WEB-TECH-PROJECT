// src/components/Signup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../signup.css";

export default function Signup({ onSignup }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "student",
    institution: "",
    department: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and numbers";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Institution validation
    if (!formData.institution.trim()) {
      newErrors.institution = "Institution name is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send this data to your backend
      const userData = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        points: 0,
        progress: 0
      };

      // Store user data (in real app, this would be an API call)
      const existingUsers = JSON.parse(localStorage.getItem('skillsphere_users') || '[]');
      localStorage.setItem('skillsphere_users', JSON.stringify([...existingUsers, userData]));

      setSuccess(true);
      
      // Auto-redirect after success
      setTimeout(() => {
        if (onSignup) {
          onSignup(userData);
        }
        navigate("/login");
      }, 3000);

    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    const strengthMap = {
      0: { label: "Very Weak", color: "#ef4444" },
      1: { label: "Weak", color: "#f97316" },
      2: { label: "Fair", color: "#eab308" },
      3: { label: "Good", color: "#84cc16" },
      4: { label: "Strong", color: "#22c55e" },
      5: { label: "Very Strong", color: "#16a34a" }
    };

    return { strength: (strength / 5) * 100, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (success) {
    return (
      <div className="modern-login-container">
        <div className="login-background">
          <div className="login-card success-card">
            <div className="success-animation">
              <div className="success-icon">🎉</div>
              <h2>Welcome to SkillSphere!</h2>
              <p>Your account has been created successfully.</p>
              <p className="redirect-text">Redirecting to login page...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-login-container">
      <div className="login-background">
        <div className="login-card signup-card">
          {/* Header Section */}
          <div className="login-header">
            <div className="logo">
              <span className="logo-icon">🎓</span>
              <h1>SkillSphere</h1>
            </div>
            <h2 className="signup-title">Join SkillSphere</h2>
            <p className="login-subtitle">Create your account and start your learning journey today!</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="institution" className="form-label">
                  Institution
                </label>
                <input
                  id="institution"
                  name="institution"
                  type="text"
                  placeholder="Your school or organization"
                  value={formData.institution}
                  onChange={handleChange}
                  className={`form-input ${errors.institution ? 'error' : ''}`}
                />
                {errors.institution && <span className="error-text">{errors.institution}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  placeholder="Your department (optional)"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="userType" className="form-label">
                I am a
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="student">🎓 Student</option>
                <option value="teacher">👨‍🏫 Teacher</option>
                <option value="professional">💼 Professional</option>
                <option value="researcher">🔬 Researcher</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{ 
                        width: `${passwordStrength.strength}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    ></div>
                  </div>
                  <span className="strength-label" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
              {errors.password && <span className="error-text">{errors.password}</span>}
              <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li className={formData.password.length >= 8 ? 'met' : ''}>At least 8 characters</li>
                  <li className={/[a-z]/.test(formData.password) ? 'met' : ''}>One lowercase letter</li>
                  <li className={/[A-Z]/.test(formData.password) ? 'met' : ''}>One uppercase letter</li>
                  <li className={/\d/.test(formData.password) ? 'met' : ''}>One number</li>
                </ul>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            {errors.submit && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {errors.submit}
              </div>
            )}

            {/* <div className="terms-agreement">
              <p>
                By creating an account, you agree to our{" "}
                <a href="#terms" className="link">Terms of Service</a> and{" "}
                <a href="#privacy" className="link">Privacy Policy</a>.
              </p>
            </div> */}

            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="login-link">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="link">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Footer */}
          <footer className="login-footer">
            <p>SkillSphere © 2025 | Educational Learning Portal</p>
            <div className="security-notice">
              <span className="security-icon">🔒</span>
              <span>Your data is securely encrypted</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}