import React, { useState, useEffect } from "react";
import Feed from "../../components/feed/Feed";
import Share from "../../components/share/Share";
import { getPosts, createPost } from "../../configuration/PostService";
import styles from "./Home.module.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await getPosts({ limit: 20 });
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading posts:", error);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Handle new post creation
  const handleNewPost = async (postData) => {
    try {
      const newPost = await createPost(postData);

      // Add the new post to the beginning of the posts array
      setPosts((prevPosts) => [newPost, ...prevPosts]);

      return { success: true };
    } catch (error) {
      console.error("Error creating post:", error);
      return { success: false, error: error.message };
    }
  };

  // Handle post deletion
  const handlePostDelete = (deletedPostId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPostId)
    );
  };

  return (
    <div className={styles.homePage}>
      <Share onPostCreated={handleNewPost} />
      <Feed
        posts={posts}
        loading={loading}
        error={error}
        onPostDelete={handlePostDelete}
        onRefresh={loadPosts}
      />
    </div>
  );
}

export default Home;
