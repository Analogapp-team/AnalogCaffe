import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/top-bar/TopBar";
import MenuBar from "../components/menu-bar/MenuBar";
import RecommendedProfiles from "../components/recommended-profiles/RecommendedProfiles";
import styles from "./MainLayout.module.css";

/* A layout component that provides the consistent visual structure for the entire application:
Defines the overall page layout (header, sidebar, main content)
Wraps page content with shared UI elements
Provides routing integration via React Router's Outlet
Creates consistent user experience across all pages

Three-Column Layout Design:
Left Column: MenuBar - Navigation sidebar
Center Column: Outlet - Dynamic page content
Right Column: RecommendedProfiles - Suggestions sidebar*/ 

function MainLayout() {
  return (
    <div className={styles.layoutContainer}>
      <TopBar />

      <div className={styles.mainBody}>
        <MenuBar />

        <div className={styles.pageArea}>
          {/* Main content area where nested routes will be rendered */}
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
