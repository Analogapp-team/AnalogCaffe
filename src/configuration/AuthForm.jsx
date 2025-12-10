import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import styles from "../../components/landing-page/LandingPage.module.css";

export default function AuthForm() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ ADD THIS VALIDATION FUNCTION
  const validateForm = () => {
    if (isLogin) {
      // Login validation
      if (!email.trim()) {
        setError("Email is required");
        return false;
      }
      if (!password.trim()) {
        setError("Password is required");
        return false;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("Please enter a valid email address");
        return false;
      }
    } else {
      // Registration validation
      if (!firstName.trim()) {
        setError("First name is required");
        return false;
      }
      if (!lastName.trim()) {
        setError("Last name is required");
        return false;
      }
      if (!email.trim()) {
        setError("Email is required");
        return false;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("Please enter a valid email address");
        return false;
      }

      if (!password.trim()) {
        setError("Password is required");
        return false;
      }
      if (!confirmPassword.trim()) {
        setError("Please confirm your password");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ ADD VALIDATION CHECK HERE
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // LOGIN FLOW
        const result = await login(email, password);
        if (result.success) {
          navigate("/");
        } else {
          setError(
            result.error || "Login failed. Please check your credentials."
          );
        }
      } else {
        // REGISTER FLOW - You can remove the duplicate checks here since validateForm handles them

        const result = await register({
          username: email,
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        });

        if (result.success) {
          setError("");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setIsLogin(true);
          // Optional: Show success message
          setTimeout(() => {
            setError(""); // Clear any success message
          }, 3000);
        } else {
          setError(result.error || "Registration failed");
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Tabs */}
      <div className={styles.tabButtons}>
        <button
          className={isLogin ? styles.activeTab : ""}
          onClick={() => {
            setIsLogin(true);
            setError("");
          }}
          type="button"
        >
          Login
        </button>

        <button
          className={!isLogin ? styles.activeTab : ""}
          onClick={() => {
            setIsLogin(false);
            setError("");
          }}
          type="button"
        >
          Register
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {isLogin ? (
          <>
            {/* LOGIN FORM */}
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
            />

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="/forgot-password" className={styles.forgotPassword}>
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </>
        ) : (
          <>
            {/* REGISTER FORM */}
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your first name"
            />

            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your last name"
            />

            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="At least 6 characters"
            />

            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Confirm your password"
            />

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </>
        )}
      </form>
    </>
  );
}
