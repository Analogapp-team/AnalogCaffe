import React from "react";
import "./ProfileAvatar.css";
import avatar from "../../assets/images/avatar.png";

const ProfileAvatar = ({ imageSrc, altText }) => {
  return (
    <img
      src={imageSrc || avatar}
      className="profile-avatar"
      alt={altText || "User avatar"}
    />
  );
};

export default ProfileAvatar;
