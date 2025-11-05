import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/top-bar/TopBar";
import MenuBar from "../components/menu-bar/MenuBar";
import RecommendedProfiles from "../components/recommended-profiles/RecommendedProfiles";

function MainLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* TopBar at the top */}
      <TopBar />

      {/* Body layout: MenuBar + feed (main content) + recommended profiles */}
      <div style={{ display: "flex", flex: 1 }}>
        {/*MenuBar*/}
        <MenuBar />

        {/* Main Feed Area - Scrollable */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <div
          style={{
            width: "350px",
            backgroundColor: "#f7f5f1",
            borderLeft: "1px solid #ebe8df",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <RecommendedProfiles />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
