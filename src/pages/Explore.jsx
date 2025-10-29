import React from "react";
import ExploreUserItem from "../components/base-components/explore-user-item/ExploreUserItem";
import profilePicture from "../assets/images/ProfilePicture.png";  // Add this import

function Explore() {
  return (
    <div>
      <h2>Explore new profiles!</h2>
      <ExploreUserItem 
        imgSrc={profilePicture}
        username="Nama Jeff"
      />
      <ExploreUserItem 
        imgSrc={profilePicture}
        username="Nama Jeff"
      />
      <ExploreUserItem 
        imgSrc={profilePicture}
        username="Nama Jeff"
      />
      <ExploreUserItem 
        imgSrc={profilePicture}
        username="Nama Jeff"
      />
      <ExploreUserItem 
        imgSrc={profilePicture}
        username="Nama Jeff"
      />
    </div>
  );
}

export default Explore;
