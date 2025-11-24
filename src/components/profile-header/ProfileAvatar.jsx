import React from "react";
import "./ProfileAvatar.css";
import defaultAvatar from "../../assets/images/profileimage.png";

const ProfileAvatar = ({ user, altText, size = 80 }) => {
  const getProfilePictureUrl = () => {
    try {
      const profilePicture = user?.get("profilePicture");

      if (profilePicture && typeof profilePicture.url === "function") {
        return profilePicture.url();
      }

      if (typeof profilePicture === "string") {
        return profilePicture;
      }

      return defaultAvatar;
    } catch (error) {
      return defaultAvatar;
    }
  };

  const profilePictureUrl = getProfilePictureUrl();
  const displayName = altText || user?.get("firstName") || "User";

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