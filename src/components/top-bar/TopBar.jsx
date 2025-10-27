import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TopBar.module.css";

function TopBar() {
  const navigate = useNavigate();

  return (
    <div className={styles.topBar}>
      <h1 className={styles.logo} onClick={() => navigate("/")}>
        ANALOG
      </h1>
    </div>
  );
}

export default TopBar;
