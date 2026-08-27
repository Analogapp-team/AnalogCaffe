import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../configuration/AuthContext";
import { getFullName } from "../../utils/User";
import { getCurrentUserProfile } from "../../configuration/UserService";
import ProfileAvatar from "../profile-header/ProfileAvatar";
import styles from "./MenuBar.module.css";

import Home from "../../assets/icons/home.svg";
import Explore from "../../assets/icons/explore.svg";
import MyProfile from "../../assets/icons/myprofile.svg";
import Events from "../../assets/icons/events.svg";
import Logout from "../../assets/icons/logout.svg";

function MenuBar() {
  const { logout, currentUser } = useAuth(); // From AuthContext
  const [user, setUser] = useState(currentUser); // Local copy with potential updates

  // Loads user on mount and when currentUser changes
  useEffect(() => {
    const loadUser = async () => {
      try {
        const freshUser = await getCurrentUserProfile();
        setUser(freshUser);
      } catch (err) {
        console.error("Error loading user in MenuBar:", err);
        setUser(currentUser);  // Fallback to auth context user
      }
    };

    if (currentUser) {
      loadUser();
    }
  }, []); // Empty dependency = runs once on mount

  // Update user when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]); // Keep in sync with auth state

  // Extract user details for display
  const fullName = getFullName(user);
  // Extract study course or provide default
  const studyCourse = user?.get("studyCourse") || ""; // Parse/Back4App data access pattern

  return (
    <div className={styles.menubar}>
      <div className={styles.navSection}>
        {/* Navigation Links */}
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
          end
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
          <div className={styles.userAvatar}>
            {user && (
              <ProfileAvatar // we're passing a size which is custom, needs some rework
                user={user}
                altText={fullName}
                size={30}
              />
            )}
          </div>
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
