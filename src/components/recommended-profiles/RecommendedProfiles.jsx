import React from "react";
import styles from "./RecommendedProfiles.module.css";

// Temp mock data with images (replace later with real user data)
const recommendedProfiles = [
  {
    name: "Liam Alexander Smith",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Emma Grace Johnson",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "Noah Benjamin Brown",
    image: "https://randomuser.me/api/portraits/men/16.jpg",
  },
  {
    name: "Olivia Marie Davis",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
  },
];

function RecommendedProfiles() {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Recommended Profiles</h3>

      <div className={styles.list}>
        {recommendedProfiles.map((profile, idx) => (
          <div key={idx} className={styles.profileRow}>
            <img src={profile.image} alt={profile.name} className={styles.avatar} />
            <div className={styles.textGroup}>
              <span className={styles.name}>{profile.name}</span>
              <a href="#" className={styles.link}>See Profile →</a>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.moreButton}>See more profiles</button>
    </div>
  );
}

export default RecommendedProfiles;