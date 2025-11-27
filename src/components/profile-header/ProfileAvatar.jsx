import React from "react";
import "./ProfileAvatar.css";
import defaultAvatar from "../../assets/images/profileimage.png";
import { parseFileToUrl } from "../../utils/Parse";
import { getFullName } from "../../utils/User";

const ProfileAvatar = ({ user, altText, size = 80 }) => {
  const profilePictureUrl = parseFileToUrl(user?.get("profilePicture")) || defaultAvatar;
  const displayName = altText || getFullName(user);

  return (
    <img
      src={profilePictureUrl}
      alt={displayName}
      className="avatar-image"
      style={{
        width: size,
        height: size,
        borderRadius: "100%",
        objectFit: "cover",
        flexShrink: 0,
      }}
      onError={(e) => (e.target.src = defaultAvatar)}
    />
  );
};

export default ProfileAvatar;