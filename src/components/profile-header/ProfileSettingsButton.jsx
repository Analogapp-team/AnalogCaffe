import React from "react";
import settingsIcon from "../../assets/icons/settings.svg";

const ProfileSettingsButton = ({ onClick }) => {
  return (
    <button
      className="ui-button ui-button--secondary ui-button--with-icon"
      onClick={onClick}
    >
      <img src={settingsIcon} alt="Settings" />
      Profile settings
    </button>
  );
};

export default ProfileSettingsButton;