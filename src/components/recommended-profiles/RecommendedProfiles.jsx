import React from "react";
import styles from "./RecommendedProfiles.module.css";

function RecommendedProfiles() {
  const recommendedProfiles = [
    { name: "Liam Alexander Smith" },
    { name: "Emma Grace Johnson" },
    { name: "Noah Benjamin Brown" },
    { name: "Olivia Marie Davis" },
  ];

  return (
    <div className={styles.recommendedContent}>
      <h3 className={styles.sectionTitle}>Recommended Profiles</h3>
      {recommendedProfiles.map((profile, index) => (
        <div key={index} className={styles.profileItem}>
          <strong className={styles.profileName}>{profile.name}</strong>
          <a href="#" className={styles.seeProfileLink}>
            See Profile →
          </a>
        </div>
      ))}
      <a href="#" className={styles.seeMoreLink}>
        See more profiles
      </a>
    </div>
  );
}

export default RecommendedProfiles;
