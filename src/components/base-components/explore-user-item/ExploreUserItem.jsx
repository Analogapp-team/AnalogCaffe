import React, { useState } from "react";
import "./ExploreUserItem.css";
import FollowButton from "../follow-button/FollowButton";

function ExploreUserItem({ imgSrc, username }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowChange = (newState) => {
    setIsFollowing(newState);
    // Add any additional logic here (e.g., API calls)
  };

  return (
    <div className="userItem">
      <div className="userInfo">
        <img 
          src={imgSrc} 
          alt="Profile" 
          className="profileAvatar"
        />
        <div className="userDetails">
          <h3 className="userName">{username}</h3>
          <p className="userDescription">KDDIT 3rd Semester</p>
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