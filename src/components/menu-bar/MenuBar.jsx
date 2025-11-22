import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../configuration/AuthContext";
import { getCurrentUserProfile } from "../../configuration/UserService";
import ProfileAvatar from "../profile-header/ProfileAvatar";
import styles from "./MenuBar.module.css";

import Home from "../../assets/icons/home.svg";
import Explore from "../../assets/icons/explore.svg";
import MyProfile from "../../assets/icons/myprofile.svg";
import Events from "../../assets/icons/events.svg";
import Logout from "../../assets/icons/logout.svg";

function MenuBar() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const freshUser = await getCurrentUserProfile();
        setUser(freshUser);
      } catch (err) {
        console.error("Error loading user in MenuBar:", err);
      }
    };

    loadUser();
  }, []);

  const firstName = user?.get("firstName") || "";
  const lastName = user?.get("lastName") || "";
  const studyCourse = user?.get("studyCourse") || "";
  const fullName = `${firstName} ${lastName}`.trim();

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
          <img src={Home} alt="" className={styles.icon} /> Home
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            isActive
              ? `${styles.menubarButton} ${styles.active}`
              : styles.menubarButton
          }
        >
          <img src={Explore} alt="" className={styles.icon} /> Explore
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? `${styles.menubarButton} ${styles.active}`
              : styles.menubarButton
          }
        >
          <img src={MyProfile} alt="" className={styles.icon} /> My Profile
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) =>
            isActive
              ? `${styles.menubarButton} ${styles.active}`
              : styles.menubarButton
          }
        >
          <img src={Events} alt="" className={styles.icon} /> Events
        </NavLink>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.userCard}>
          <div className={styles.userAvatar}></div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{fullName || "User"}</p>
            <p className={styles.userDetails}>
              {studyCourse || "No Study Line Set"}
            </p>
          </div>
        </div>

        <button onClick={logout} className={styles.logoutButton}>
          <img src={Logout} alt="" className={styles.icon} /> Log out
        </button>
      </div>
    </div>
  );
}

export default MenuBar;