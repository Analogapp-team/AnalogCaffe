import React from "react";
import "./Profile.css"; // or ProfileOverview.css if that’s the current name
import ProfileHeader from "../components/profile-header/ProfileHeader"; // ✅ fixed path

const Profile = () => {
  return (
    <div className="profile-page">
      <ProfileHeader />
    </div>
  );
};

export default Profile;