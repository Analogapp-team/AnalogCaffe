import React, { useEffect, useState } from "react";
import "./Profile.css";
import ProfileHeader from "../components/profile-header/ProfileHeader";
import { useParams } from "react-router-dom";
import { getUserById } from "../configuration/UserService";
import { useAuth } from "../configuration/AuthContext";
import { getUserPosts } from "../configuration/PostService";
import Post from "../components/Post/Post";
// Removed unused imports

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      if (!userId) {
        setProfileUser(currentUser);
        return;
      }
      try {
        const fetched = await getUserById(userId);
        if (!mounted) return;
        setProfileUser(fetched);
      } catch (err) {
        console.error("Failed to load profile user", err);
        setProfileUser(null);
      }
    };
    fetchUser();
    return () => (mounted = false);
  }, [userId, currentUser]);

  // EFFECT TO FETCH USER POSTS
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!profileUser) return;
      try {
        const posts = await getUserPosts(profileUser.id);
        setUserPosts(posts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    fetchUserPosts();
  }, [profileUser]);

  return (
    <div className="profile-page">
      <ProfileHeader user={profileUser} />
      {userPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Profile;
