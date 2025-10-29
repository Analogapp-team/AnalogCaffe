import React from "react";
import ExploreUserItem from "../components/base-components/explore-user-item/ExploreUserItem";
import profilePicture from "../assets/images/ProfilePicture.png";  // Add this import

function Explore() {
  return (
    <div>
      <div>
        <h2>Explore profiles!</h2>
        <body>Explore profiles you’re interested in!</body>
      </div>
      <br />
      <br />
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
