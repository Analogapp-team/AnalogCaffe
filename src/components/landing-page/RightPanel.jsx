import React, { useState } from "react";
import styles from "./LandingPage.module.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function RightPanel() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.rightPanel}>
      <div className={styles.formContainer}>
        {/* Toggle Login/Register buttons */}
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

        {/* FORMS */}
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
