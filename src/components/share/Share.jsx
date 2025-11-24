import React, { useState, useEffect } from "react";
import { useAuth } from "../../configuration/AuthContext";
import { createPost } from "../../configuration/PostService";
import styles from "./share.module.css";
import image from "../../assets/icons/image.svg";
import ProfileAvatar from "../profile-header/ProfileAvatar";

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
        
        {/* Top Section: Avatar + Input */}
        <div className={styles.shareTop}>
          <div className={styles.shareProfileImgWrapper}>
            {displayUser && <ProfileAvatar user={displayUser} size={40} />}
          </div>

          <textarea
            placeholder="What's in your mind?"
            className={styles.shareInput}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            rows="3"
          />
        </div>

        {/* Image previews */}
        {imagePreviews.length > 0 && (
          <div className={styles.imagePreviews}>
            {imagePreviews.map((preview, index) => (
              <div key={index} className={styles.imagePreviewItem}>
                <img
                  src={preview.preview}
                  alt="Preview"
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  className={styles.removeImageButton}
                  onClick={() => removeImage(index)}
                  disabled={loading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Bottom Section */}
        <div className={styles.shareBottom}>
          <div className={styles.shareOptions}>
            <label htmlFor="post-image-input" className={styles.fileInputLabel}>
              <img className={styles.shareIcon} src={image} alt="Add photo" />
              <span className={styles.shareOptionText}>
                {images.length > 0 ? `${images.length} photo(s)` : "Add photo"}
              </span>
            </label>
            <input
              id="post-image-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              disabled={loading}
              style={{ display: "none" }}
            />
          </div>

          <button
            className={styles.shareButton}
            onClick={handlePost}
            disabled={loading || (!content.trim() && images.length === 0)}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Share;