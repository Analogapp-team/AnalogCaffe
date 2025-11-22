import React from "react";
import "./ProfileHeader.css";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import ProfileSettingsButton from "./ProfileSettingsButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../configuration/AuthContext";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const firstName = currentUser?.get("firstName") || "";
  const lastName = currentUser?.get("lastName") || "";
  const studyCourse = currentUser?.get("studyCourse") || "";
  const bio = currentUser?.get("bio") || "";

  const handleSettingsClick = () => {
    navigate("/profile/settings");
  };

  return (
    <div className="profile-header">
      <div className="profile-left">

       
        <ProfileAvatar user={currentUser} altText={`${firstName} ${lastName}`} />

        <div className="profile-details">
          <ProfileInfo
            name={`${firstName} ${lastName}`}
            study={studyCourse}
            bio={bio}
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