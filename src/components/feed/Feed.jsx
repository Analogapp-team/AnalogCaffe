import React from "react";
import Post from "../Post/Post";
import styles from "./Feed.module.css";

function Feed({ posts, loading, error, onPostDelete, onRefresh }) {
  // Remove all useState and useEffect hooks - they come from props now

  if (loading) {
    return (
      <div className={styles.feed}>
        <div className={styles.feedWrapper}>
          <div className={styles.loadingState}>Loading posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.feed}>
        <div className={styles.feedWrapper}>
          <div className={styles.errorState}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.feed}>
      <div className={styles.feedWrapper}>
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
          </div>
        ) : (
          posts.map((post) => (
            <Post key={post.id} post={post} onDelete={onPostDelete} />
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;
