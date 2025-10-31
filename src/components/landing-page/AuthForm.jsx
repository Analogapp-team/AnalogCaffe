import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./LandingPage.module.css";

export default function AuthForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      login();
      navigate("/");
    }
  };

  return (
    <>
      <div className={styles.tabButtons}>
        <button
          className={isLogin ? styles.activeTab : ""}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? styles.activeTab : ""}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
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
            Remember me
          </label>
          <a href="/forgot-password" className={styles.forgotPassword}>
            Forgot your password?
          </a>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Sign in
        </button>
      </form>
    </>
  );
}
