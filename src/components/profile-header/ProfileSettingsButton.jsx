import React from "react";
import "./ProfileSettingsButton.css";
import settingsIcon from "../../assets/icons/settings.svg";

const ProfileSettingsButton = ({ onClick }) => {
  return (
    <button className="profile-settings-btn" onClick={onClick}>
      <img src={settingsIcon} alt="Settings icon" className="settings-icon" />
      Profile settings
    </button>
  );
};

export default ProfileSettingsButton;