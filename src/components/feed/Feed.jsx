import React from "react";
import styles from "./Feed.module.css";

function Feed() {
  return (
    <div className={styles.container}>
      <img
        src="https://via.placeholder.com/48"
        alt="avatar"
        className={styles.avatar}
      />
      <div className={styles.inputBox}>
        <input type="text" placeholder="What's on your mind?" />
      </div>
      <div className={styles.actions}>
        <button className={styles.addPhotoIcon}>📷 Add photo</button>
        <button>Post</button>
      </div>
    </div>
  );
}

export default Feed;
