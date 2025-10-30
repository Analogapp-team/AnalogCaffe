import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TopBar.module.css";
import bannerImage from "../../assets/images/Analog banner image.png"; // ✅ banner background
import logo from "../../assets/images/logo.png"; // ✅ logo image

function TopBar() {
  const navigate = useNavigate();

  return (
    <div
      className={styles.topBar}
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      <img
        src={logo}
        alt="Analog Logo"
        className={styles.logo}
        onClick={() => navigate("/")}
      />
    </div>
  );
}

export default TopBar;
