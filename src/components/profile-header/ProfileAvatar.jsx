import React from "react";
import "./ProfileAvatar.css";
import defaultAvatar from "../../assets/images/profileimage.png";

const ProfileAvatar = ({ user, altText }) => {
  // Safe profile picture URL extraction
  const getProfilePictureUrl = () => {
    try {
      const profilePicture = user?.get("profilePicture");

      console.log("📸 Profile picture data:", profilePicture);

      // If profilePicture exists and has a url method (Parse.File)
      if (profilePicture && typeof profilePicture.url === "function") {
        const url = profilePicture.url();
        console.log("✅ Generated URL:", url);
        return url;
      }

      // If profilePicture is already a string URL
      if (typeof profilePicture === "string") {
        return profilePicture;
      }

      // Fallback to default avatar from assets
      return defaultAvatar;
    } catch (error) {
      console.error("❌ Error getting profile picture URL:", error);
      return defaultAvatar;
    }
  };

  const profilePictureUrl = getProfilePictureUrl();
  const displayName = user?.get("firstName") || altText || "User";

  console.log("🎯 Final avatar URL:", profilePictureUrl);

  return (
    <div className="profile-avatar">
      <img
        src={profilePictureUrl || defaultAvatar}
        alt={displayName}
        className="avatar-image"
        onError={(e) => {
          console.log("🖼️ Image failed to load, using default");
          e.target.src = defaultAvatar;
        }}
        onLoad={() => console.log("🖼️ Image loaded successfully")}
      />
    </div>
  );
};

export default ProfileAvatar;