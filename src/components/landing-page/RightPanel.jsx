import React from "react";
import styles from "./LandingPage.module.css";
import AuthForm from "../../configuration/AuthForm";

export default function RightPanel() {
  return (
    <div className={styles.rightPanel}>
      <div className={styles.formContainer}>
        <AuthForm />
      </div>
    </div>
  );
}
