import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../configuration/AuthContext";
import styles from "./LandingPage.module.css";

/* LoginForm component that handles user authentication in a React application.
   clear separation of concerns—it manages only UI state (email, password, loading, error)
  while delegating actual authentication to the useAuth hook, 
  and it provides immediate user feedback via disabled buttons and error messages.
  useState: Manages local form state (email, password, loading, error)
  useNavigate: React Router hook for programmatic navigation (SPA-friendly routing)
  useAuth: Custom authentication context hook (likely provides login() method)
  CSS Modules: Scoped styling to prevent class name collisions*/ 

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();   // Prevent default form submission
    setLoading(true);     // Show loading state
    setError("");        // Clear previous errors

    const result = await login(email, password); // Call authentication API

    if (result.success) {
      navigate("/");  // Redirect to home page
    } else {
      setError(result.error || "Login failed");
    }

    setLoading(false); // Reset loading state
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <label>Email Address</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className={styles.formOptions}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" />
          <span>Remember me</span>
        </label>

        <a href="/forgot-password" className={styles.forgotPassword}>
          Forgot your password?
        </a>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

