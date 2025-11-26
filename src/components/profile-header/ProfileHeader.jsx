import React from "react";
import "./ProfileHeader.css";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import ProfileSettingsButton from "./ProfileSettingsButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../configuration/AuthContext";
import { getFullName } from "../../utils/User";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const fullName = getFullName(currentUser);
  const studyCourse = currentUser?.get("studyCourse") || "";
  const bio = currentUser?.get("bio") || "";

  const handleSettingsClick = () => {
    navigate("/profile/settings");
  };

  return (
    <div className="profile-header">
      <div className="profile-left">

       
        <ProfileAvatar user={currentUser} altText={fullName} />

        <div className="profile-details">
          <ProfileInfo
            name={fullName}
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