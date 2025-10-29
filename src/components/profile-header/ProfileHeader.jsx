import React from "react";
import "./ProfileHeader.css";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import ProfileSettingsButton from "./ProfileSettingsButton";
import { useNavigate } from "react-router-dom";

const ProfileHeader = () => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/profile/settings");
    // add navigation logic here (React Router)
  };

  return (
    <div className="profile-header">
      <div className="profile-left">
        <ProfileAvatar altText="Sarah M." />
        <div className="profile-details">
          <ProfileInfo
            name="Sarah M."
            study="MSc. Computer Science"
            bio="I’m a coffee addict... obviously ☕"
          />
        </div>
      </div>

      <div className="profile-right">
        <ProfileSettingsButton onClick={handleSettingsClick} />
      </div>
    </div>
  );
};

export default ProfileHeader;
