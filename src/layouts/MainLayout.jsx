import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/top-bar/TopBar";
import SideBar from "../components/side-bar/SideBar";

function MainLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* TopBar at the top */}
      <TopBar />

      {/* Body layout: sidebar + main content + recommended profiles (still need to be made) */}
      <div style={{ display: "flex", flex: 1 }}>
        <SideBar />
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
      </div>
    </div>
  );
}

export default MainLayout;