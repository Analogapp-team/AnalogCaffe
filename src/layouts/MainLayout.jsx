import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/top-bar/TopBar";
import MenuBar from "../components/menu-bar/MenuBar";
import RecommendedProfiles from "../components/recommended-profiles/RecommendedProfiles";
import styles from "./MainLayout.module.css";

function MainLayout() {
  return (
    <div className={styles.layoutContainer}>
      <TopBar />

      <div className={styles.mainBody}>
        <MenuBar />

        <div className={styles.pageArea}>
          <Outlet />
        </div>

        <div className={styles.recommendedSidebar}>
          <RecommendedProfiles />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;