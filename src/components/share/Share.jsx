import React, { useState, useEffect } from "react";
import { useAuth } from "../../configuration/AuthContext";
import { createPost } from "../../configuration/PostService";
import styles from "./share.module.css";
// import ProfileAvatar from "../profile-header/ProfileAvatar"; // moved to ShareTop
import ShareTop from "./ShareTop";
import ShareBottom from "./ShareBottom";

function Share() {
  const { currentUser, refreshCurrentUser } = useAuth();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [freshUser, setFreshUser] = useState(null);

  // Always load latest user (fixes avatar instantly updating)
  useEffect(() => {
    const loadFreshUser = async () => {
      try {
        // Fetch updated user profile
        const updatedUser = await refreshCurrentUser();
        // Update local state
        setFreshUser(updatedUser);
      } catch (err) {
        console.error("Error refreshing user:", err);
        setFreshUser(currentUser);
      }
    };

    // Load the fresh user data when currentUser or refreshCurrentUser changes
    loadFreshUser();
  }, [currentUser, refreshCurrentUser]);

  // Determine which user object to display (freshly loaded or current)
  const displayUser = freshUser || currentUser;

  // Handle image file selection
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);

    // Only proceed if files were selected
    if (files.length > 0) {
      setImages(files);
      // Generate preview URLs
      setImagePreviews(files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })));
    }
  };

  // Remove selected image
  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle post submission
  const handlePost = async () => {
    // Validate post content or images
    if (!content.trim() && images.length === 0) {
      setError("Please write something or add a photo to post");
      return; // Early return on validation failure
    }

    setLoading(true);
    setError("");

    try {
      // Create the post with trimmed content and selected images
      await createPost({ content: content.trim(), images });

      setContent("");
      setImages([]);
      setImagePreviews([]);

      // Clear file input value
      const fileInput = document.getElementById("post-image-input");
      if (fileInput) fileInput.value = "";

      // Simple + effective
      window.location.reload();
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.share}>
      <div className={styles.shareWrapper}>
        
        <ShareTop
          user={displayUser}
          content={content}
          setContent={setContent}
          loading={loading}
          imagePreviews={imagePreviews}
          removeImage={removeImage}
        />

        {/* Image previews (handled by ShareTop) */}

        {error && <div className={styles.errorMessage}>{error}</div>}

        <ShareBottom
          images={images}
          loading={loading}
          onImageSelect={handleImageSelect}
          onPost={handlePost}
          content={content}
        />
      </div>
    </div>
  );
}

export default Share;