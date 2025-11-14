import React from "react";
import ExploreUserItem from "../components/base-components/explore-user-item/ExploreUserItem";
import profilePicture from "../assets/images/ProfilePicture.png";  // Add this import

function Explore() {
  return (
    <div>
      <div>
        <h2>Explore profiles!</h2>
        <div>Explore profiles you’re interested in!</div>
      </div>
      <br />
      <br />
      <ExploreUserItem 
        imgSrc={profilePicture}
        username="Nama Jeff"
        desc="KDDIT 4rd Semester"
      />
      <ExploreUserItem 
        imgSrc={profilePicture}
        username="Ma Nama Jeff"
        desc="KDDIT 3rd Semester"
      />
      <ExploreUserItem 
        imgSrc={profilePicture}
        username="Banana Jeff"
        desc="KDDIT 2nd Semester"
      />
      <ExploreUserItem 
        imgSrc={profilePicture}
        username="Nama Geff"
        desc="BDDIT 3rd Semester"
      />
      <ExploreUserItem 
        imgSrc={profilePicture}
        username="Nama Jæf"
        desc="SD 1st Semester"
      />
   
    </div>
  );
}

export default Explore;