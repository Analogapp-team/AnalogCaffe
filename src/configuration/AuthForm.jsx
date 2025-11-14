import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import styles from "../components/landing-page/LandingPage.module.css";

export default function AuthForm() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // LOGIN FLOW
        const result = await login(email, password);
        if (result.success) {
          navigate("/");
        } else {
          setError(result.error || "Login failed");
        }
      } else {
        // REGISTER FLOW
        if (!username || !email || !password || !confirmPassword) {
          setError("All fields are required");
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        const result = await register({
          username,
          email,
          password,
        });

        if (result.success) {
          setError("");
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setIsLogin(true);
        } else {
          setError(result.error || "Registration failed");
        }
      }
    } catch (error) {
      setError("An unexpected error occurred");
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
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
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
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />

            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
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
