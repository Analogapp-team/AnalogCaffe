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

        <main className={styles.pageArea}>
          <Outlet />
        </main>

        <aside className={styles.recommendedSidebar}>
          <RecommendedProfiles />
        </aside>
      </div>
    </div>
  );
}

export default MainLayout;