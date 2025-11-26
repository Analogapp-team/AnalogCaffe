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
        const updatedUser = await refreshCurrentUser();
        setFreshUser(updatedUser);
      } catch (err) {
        console.error("Error refreshing user:", err);
        setFreshUser(currentUser);
      }
    };

    loadFreshUser();
  }, [currentUser, refreshCurrentUser]);

  const displayUser = freshUser || currentUser;

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setImages(files);
      setImagePreviews(files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })));
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!content.trim() && images.length === 0) {
      setError("Please write something or add a photo to post");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createPost({ content: content.trim(), images });

      setContent("");
      setImages([]);
      setImagePreviews([]);

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