import React from "react";
import styles from "./LandingPage.module.css";
import cafeBackground from "../../assets/images/cafe-background.jpg";
import LogoHeader from "./LogoHeader";
import HeroText from "./HeroText";

export default function LeftPanel() {
  return (
    <div
      className={styles.leftPanel}
      style={{ backgroundImage: `url(${cafeBackground})` }}
    >
      <LogoHeader />
      <HeroText />
    </div>
  );
}
