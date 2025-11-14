import React from "react";
import "./ProfileInfo.css";

const ProfileInfo = ({ name, study, bio }) => {
  return (
    <div className="profile-info">
      <h2 className="profile-name">{name}</h2>
      <p className="profile-study">{study}</p>
      <p className="profile-bio">{bio}</p>
    </div>
  );
};

export default ProfileInfo;
