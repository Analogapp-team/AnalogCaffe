import React, { useState, useEffect } from "react";
import styles from "./RecommendedProfiles.module.css";
import { useNavigate, Link } from "react-router-dom";
import Parse from "../../configuration/Back4App";
import { parseFileToUrl } from "../../utils/Parse";
import { getFullName } from "../../utils/User";
import defaultAvatar from "../../assets/images/profileimage.png";

/* A component that fetches user profiles from the backend (Parse/Back4App)
   displays them in a list with avatars and names, provides navigation to individual profiles
   Offers exploration with a "See more" button and handles loading and error states*/ 

function RecommendedProfiles() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]); // Array of profile objects
  const [loading, setLoading] = useState(true); // Data fetching status

  // Data fetching effect
  useEffect(() => {
    const fetchProfiles = async () => {
      const q = new Parse.Query(Parse.User); // Create Parse query, Query the User class.
      q.limit(4);
      q.descending("createdAt"); // Newest users first
      try {
        const results = await q.find(); // Execute query

        // Transform Parse objects to simple profile objects
        const mapped = results.map((u) => ({
          userId: u.id,
          name: getFullName(u),
          image: parseFileToUrl(u.get("profilePicture")) || defaultAvatar,
        }));
        setProfiles(mapped); // Update state
      } catch (err) {
        console.error("Failed to load recommended profiles", err);
      } finally {
        setLoading(false); // Always stop loading
      }
    };
    fetchProfiles();
  }, []); // Empty dependency array = runs once on mount

  if (loading) return <div>Loading recommended profiles...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>Recommended Profiles</h3>

        <div className={styles.list}>
          {profiles.map((profile, idx) => (
            <div key={idx} className={styles.profileRow}>
              <img src={profile.image} alt={profile.name} className={styles.avatar} />
              <div className={styles.textGroup}>
                <span className={styles.name}>{profile.name}</span>
                <Link to={`/profile/${profile.userId}`} className={styles.link}>See Profile →</Link>
              </div>
            </div>
          ))}
        </div>

        <button 
        onClick={() => navigate("/explore")} 
        className={styles.moreButton}>See more profiles</button>
      </div>
    </div>
  );
}

export default RecommendedProfiles;
