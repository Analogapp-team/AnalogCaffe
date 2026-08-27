import React from "react";
import Post from "../Post/Post";
import styles from "./Feed.module.css";

/*Feed component - a presentational container that displays a list of posts 
  with loading, error, and empty states receiving all data via props for clean separation 
  of concerns, making it reusable, testable, and focused solely on UI rendering.*/ 

function Feed({ posts, loading, error, onPostDelete, onRefresh }) {
  /*posts: Array of post objects to display
  loading: Boolean, whether data is currently loading
  error: String | null, Error message if loading failed
  onPostDelete: Function, Callback when a post is deleted
  onRefresh: Function [Note: Declared but not used in this version]*/ 

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
