import React, { useState, useEffect } from "react";
import styles from "./RecommendedProfiles.module.css";
import { useNavigate, Link } from "react-router-dom";
import Parse from "../../configuration/Back4App";
import { parseFileToUrl } from "../../utils/Parse";
import { getFullName } from "../../utils/User";
import defaultAvatar from "../../assets/images/profileimage.png";

function RecommendedProfiles() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const q = new Parse.Query(Parse.User);
      q.limit(4);
      q.descending("createdAt");
      try {
        const results = await q.find();
        const mapped = results.map((u) => ({
          userId: u.id,
          name: getFullName(u),
          image: parseFileToUrl(u.get("profilePicture")) || defaultAvatar,
        }));
        setProfiles(mapped);
      } catch (err) {
        console.error("Failed to load recommended profiles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

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