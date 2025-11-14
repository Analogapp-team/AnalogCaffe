import React from "react";
import Feed from "../../components/feed/Feed";
import Share from "../../components/share/Share";
import Post from "../../components/Post/Post";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.homePage}>
      <Share />
      <Feed />
    </div>
  );
}

export default Home;
