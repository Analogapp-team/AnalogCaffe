import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExploreUserItem.css";
import FollowButton from "../follow-button/FollowButton";

function ExploreUserItem({ imgSrc, userId, desc, displayName }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  const handleFollowChange = (newState) => {
    setIsFollowing(newState);
    // Add any additional logic here (e.g., API calls)
  };

  const handleNavigate = () => {
    if (userId) {
      navigate(`/profile/${encodeURIComponent(userId)}`);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="userItem">
      <div
        className="userInfo"
        role="link"
        tabIndex={0}
        aria-label={`Open profile of ${displayName || userId || "user"}`}
        onClick={handleNavigate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigate();
          }
        }}
      >
        <img
          src={imgSrc}
          alt="Profile"
          className="profileAvatar"
        />
        <div className="userDetails">
          <h3 className="userName">{displayName || userId}</h3>
          <p className="userDescription">{desc}</p>
        </div>
      </div>
      <FollowButton
        following={isFollowing}
        onFollowChange={handleFollowChange}
      />
    </div>
  );
}

export default ExploreUserItem;