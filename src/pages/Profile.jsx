import React from "react";
import "./Profile.css";
import ProfileHeader from "../components/profile-header/ProfileHeader";
import Post from "../components/modules/post/Post";
import profilePicture from "../assets/images/ProfilePicture.png";
import postImage from "../assets/images/postimage.png";

const Profile = () => {
  return (
    <div className="profile-page">
      <ProfileHeader />
      <Post
        author={{
          name: "Sarah M. - Msc. Computer Science",
          avatar: profilePicture,
        }}
        timestamp="2h ago"
        content="Something something also coffee! ☕"
        image={postImage}
        polaroids={[
          { name: "Liam Alexander Smith", image: postImage },
          { name: "Liam Alexander Smith", image: postImage },
          { name: "Liam Alexander Smith", image: postImage },
          { name: "Liam Alexander Smith", image: postImage },
          { name: "Liam Alexander Smith", image: postImage },
          { name: "Liam Alexander Smith", image: postImage },
          { name: "Liam Alexander Smith", image: postImage },
          { name: "Liam Alexander Smith", image: postImage },
          { name: "Liam Alexander Smith", image: postImage },
          { name: "Emma Grace Johnson", image: profilePicture },
        ]}
      />
    </div>
  );
};

export default Profile;
