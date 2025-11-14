import React, { useState, useEffect } from "react";
import Post from "../Post/Post";
import { getPosts } from "../../configuration/PostService";
import styles from "./Feed.module.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      console.log("Fetching posts from Back4App...");
      const postsData = await getPosts({ limit: 20 });
      console.log("Posts fetched:", postsData);
      console.log("Number of posts:", postsData.length);
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle post deletion
  const handlePostDelete = (deletedPostId) => {
    setPosts(posts.filter((post) => post.id !== deletedPostId));
  };

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
          // onDelete PROP
          posts.map((post) => (
            <Post key={post.id} post={post} onDelete={handlePostDelete} />
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;
