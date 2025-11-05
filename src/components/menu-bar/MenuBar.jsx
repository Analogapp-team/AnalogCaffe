import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./MenuBar.module.css";

function MenuBar() {
  const { logout } = useAuth();

  const user = {
    name: "John Doe",
    studyLine: "KDDIT",
    semester: "3rd Semester",
  };

  return (
    <div className={styles.menubar}>
      <div className={styles.navSection}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? `${styles.menubarButton} ${styles.active}`
              : styles.menubarButton
          }
        >
          <span>{/* Placeholder for icon */}</span> Home
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            isActive
              ? `${styles.menubarButton} ${styles.active}`
              : styles.menubarButton
          }
        >
          <span>{/* Placeholder for icon */}</span> Explore
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? `${styles.menubarButton} ${styles.active}`
              : styles.menubarButton
          }
        >
          <span>{/* Placeholder for icon */}</span> My Profile
        </NavLink>

        {/* Placeholder tab for future features */}
        <NavLink
          to="/dinmor"
          className={({ isActive }) =>
            isActive
              ? `${styles.menubarButton} ${styles.active}`
              : styles.menubarButton
          }
        >
          <span>{/* Placeholder for icon */}</span> Din Mor
        </NavLink>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.userCard}>
          <div className={styles.userAvatar}></div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.name}</p>
            <p className={styles.userDetails}>
              {user.studyLine} {user.semester}
            </p>
          </div>
        </div>

        <button onClick={logout} className={styles.logoutButton}>
          <span>{/* Placeholder for icon */}</span>↩ Log out
        </button>
      </div>
    </div>
  );
}

export default MenuBar;
