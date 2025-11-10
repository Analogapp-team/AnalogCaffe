import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./LandingPage.module.css";

export default function AuthForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // LOGIN FLOW
      if (email && password) {
        login({
          name: "Din Mor", // placeholder until backend
          studyLine: "KDDIT",
          semester: "3rd Semester",
        });
        navigate("/");
      }
    } else {
      // REGISTER FLOW
      if (!username || !email || !password || !confirmPassword) return;

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // Later: Send to backend here
      console.log("REGISTER USER:", { username, email });

      login({
        name: username,
        studyLine: "New member",
        semester: "",
      });
      navigate("/");
    }
  };

  return (
    <>
      {/* Toggle Tabs */}
      <div className={styles.tabButtons}>
        <button className={isLogin ? styles.activeTab : ""} onClick={() => setIsLogin(true)}>
          Login
        </button>

        <button className={!isLogin ? styles.activeTab : ""} onClick={() => setIsLogin(false)}>
          Register
        </button>
      </div>

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
              <a href="#" className={styles.forgotPassword}>
                Forgot your password?
              </a>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Sign in
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
            />

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

            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className={styles.submitBtn}>
              Create account
            </button>
          </>
        )}
      </form>
    </>
  );
}

