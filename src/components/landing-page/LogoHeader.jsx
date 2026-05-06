import React from "react";
import styles from "./LandingPage.module.css";
import logo from "../../assets/images/logo.png";

export default function LogoHeader() {
  return (
    <div className={styles.logoWrapper}>
      <img src={logo} alt="Café Analog Logo" className={styles.logo} />
    </div>
  );
}
