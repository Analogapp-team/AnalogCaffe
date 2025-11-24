import React from "react";
import "./Profile.css";
import ProfileHeader from "../components/profile-header/ProfileHeader";
import Post from "../components/Post/Post";
import profilePicture from "../assets/images/ProfilePicture.png";
import postImage from "../assets/images/postimage.png";

const Profile = () => {
  return (
    <div className="profile-page">
      <ProfileHeader />
      <Post/>

    </div>
  );
};

export default Profile;
