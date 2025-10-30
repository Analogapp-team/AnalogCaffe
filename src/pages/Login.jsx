import React from "react";
import styles from "../components/landing-page/LandingPage.module.css";
import LeftPanel from "../components/landing-page/LeftPanel";
import RightPanel from "../components/landing-page/RightPanel";

export default function Login() {
  return (
    <div className={styles.container}>
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
