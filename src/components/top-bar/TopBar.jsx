import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TopBar.module.css";
import bannerImage from "../../assets/images/analog-banner-image.png";
import logo from "../../assets/images/logo.png";

/* A simple, presentational header component that provides:
   Brand identity display (logo)
   Primary navigation (home link via logo click)
   Visual branding (full-width banner background)
   Minimalist design (no navigation menu, just logo
*/ 

function TopBar() {
  const navigate = useNavigate();

  return (
    <div
      className={styles.topBar}
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <div className={styles.logoContainer}>
        <img
          src={logo}
          alt="Analog Logo"
          className={styles.logo}
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
}

export default TopBar;
