import React, { useEffect, useState } from "react";
import "./Profile.css";
import ProfileHeader from "../components/profile-header/ProfileHeader";
import { useParams } from "react-router-dom";
import { getUserById } from "../configuration/UserService";
import { useAuth } from "../configuration/AuthContext";
import Post from "../components/Post/Post";
// Removed unused imports

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);

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
  return (
    <div className="profile-page">
      <ProfileHeader user={profileUser} />
      <Post/>

    </div>
  );
};

export default Profile;
