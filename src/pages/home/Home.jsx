import React from "react";
import Feed from "../../components/feed/Feed";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.homePage}>
      <Feed />
    </div>
  );
}

export default Home;
