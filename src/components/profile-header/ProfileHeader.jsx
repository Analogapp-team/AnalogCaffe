import React from "react";
import "./ProfileHeader.css";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import ProfileSettingsButton from "./ProfileSettingsButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../configuration/AuthContext";
import { getFullName } from "../../utils/User";

const ProfileHeader = ({ user }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // useAuth() is a custom hook that provides authentication state
  const useUser = user || currentUser; // currentUser represents the currently logged-in user (or null if logged out)
  /*Creates a variable useUser that represents which user's profile to display
    Uses the logical OR (||) operator for fallback logic
    Follows this priority: user prop → currentUser → undefined*/ 

  const fullName = getFullName(useUser);
  const studyCourse = useUser?.get("studyCourse") || "";
  const bio = useUser?.get("bio") || "";

  const isOwnProfile =
    currentUser && useUser && currentUser.id === useUser.id;

  const handleSettingsClick = () => {
    navigate("/profile/settings");
  };

  return (
    <div className="profile-header">
      <div className="profile-left">
        <ProfileAvatar user={useUser} altText={fullName} />

        <div className="profile-details">
          <ProfileInfo name={fullName} study={studyCourse} bio={bio} />
        </div>
      </div>

      <div className="profile-right">
        {isOwnProfile && (
          <ProfileSettingsButton onClick={handleSettingsClick} />
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;

/* This initialization block determines the component's behavior. It:
   Sets up dependencies (navigation, authentication)
   Resolves the core question: "Whose profile are we showing?"
   Enables multiple use cases with simple, clean logic
   Follows React best practices with hooks and prop-based design
   The elegance is in its simplicity—three lines of code that handle 
   complex business logic about user identity and profile viewing permissions.*/