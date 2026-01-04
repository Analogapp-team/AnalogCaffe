import React, { useState, useEffect, useRef } from "react"; // 1. Import useRef
import { useAuth } from "../../configuration/AuthContext";
import styles from "./share.module.css";
import ShareTop from "./ShareTop";
import ShareBottom from "./ShareBottom";

function Share({ onPostCreated }) {
  const { currentUser, refreshCurrentUser } = useAuth();
  
  // 2. Create the ref to control the file input
  const fileInputRef = useRef(null);

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [freshUser, setFreshUser] = useState(null);

  // Always load latest user (fixes avatar instantly updating)
  useEffect(() => {
    const loadFreshUser = async () => {
      if (!currentUser) {
        setFreshUser(null);
        return; // Stop here, don't run the rest of the function
      }

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
      setImagePreviews(
        files.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }))
      );
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
      const result = await onPostCreated({
        content: content.trim(),
        images,
      });

      if (result.success) {
        setContent("");
        setImages([]);
        setImagePreviews([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(result.error || "failed to createpost");
      }
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

        {error && <div className={styles.errorMessage}>{error}</div>}

        <ShareBottom
          fileInputRef={fileInputRef}
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