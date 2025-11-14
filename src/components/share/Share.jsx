import React, { useState, useEffect } from "react";
import { useAuth } from "../../configuration/AuthContext";
import { createPost } from "../../configuration/PostService";
import { getCurrentUserProfile } from "../../configuration/UserService";
import styles from "./share.module.css";
import image from "../../assets/icons/image.svg";

function Share() {
  const { currentUser } = useAuth();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [freshUser, setFreshUser] = useState(null);

  // Get fresh user data on component mount
  useEffect(() => {
    const loadFreshUser = async () => {
      try {
        const userData = await getCurrentUserProfile();
        setFreshUser(userData);
      } catch (error) {
        console.error("Error loading fresh user:", error);
        setFreshUser(currentUser);
      }
    };

    loadFreshUser();
  }, [currentUser]);

  // Use freshUser if available, otherwise fallback to currentUser
  const displayUser = freshUser || currentUser;

  const getProfilePictureUrl = () => {
    try {
      if (!displayUser) {
        return "/default-avatar.png";
      }

      const profilePicture = displayUser.get("profilePicture");

      if (profilePicture && typeof profilePicture.url === "function") {
        return profilePicture.url();
      }

      if (typeof profilePicture === "string") {
        return profilePicture;
      }

      return "/default-avatar.png";
    } catch (error) {
      console.error("Error getting profile picture:", error);
      return "/default-avatar.png";
    }
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);

    if (files.length > 0) {
      setImages(files);

      // Create image previews
      const previews = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index].preview);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handlePost = async () => {
    // Allow posts with only images OR only text OR both
    if (!content.trim() && images.length === 0) {
      setError("Please write something or add a photo to post");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("📤 Creating post with:", {
        content: content.trim(),
        contentExists: !!content.trim(),
        imagesCount: images.length,
      });

      const result = await createPost({
        content: content.trim(),
        images: images,
      });

      console.log("✅ Post created successfully:", result);
      setContent("");
      setImages([]);
      setImagePreviews([]);

      // Clear file input
      const fileInput = document.getElementById("post-image-input");
      if (fileInput) fileInput.value = "";

      // Refresh the page to show new post
      window.location.reload();
    } catch (error) {
      console.error("Error creating post:", error);
      setError(
        "Failed to create post. Please try again. Error: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const profilePictureUrl = getProfilePictureUrl();

  return (
    <div className={styles.share}>
      <div className={styles.shareWrapper}>
        {/* Top Section: Profile Picture + Input */}
        <div className={styles.shareTop}>
          <img
            className={styles.shareProfileImg}
            src={profilePictureUrl}
            alt="Your profile"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <textarea
            placeholder="What's in your mind?"
            className={styles.shareInput}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            rows="3"
          />
        </div>

        {imagePreviews.length > 0 && (
          <div className={styles.imagePreviews}>
            {imagePreviews.map((preview, index) => (
              <div key={index} className={styles.imagePreviewItem}>
                <img
                  src={preview.preview}
                  alt={`Preview ${index + 1}`}
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

        {/* Bottom Section: Actions */}
        <div className={styles.shareBottom}>
          <div className={styles.shareOptions}>
            <div className={styles.shareOption}>
              <label
                htmlFor="post-image-input"
                className={styles.fileInputLabel}
              >
                <img className={styles.shareIcon} src={image} alt="Add photo" />
                <span className={styles.shareOptionText}>
                  {images.length > 0
                    ? `${images.length} photo(s)`
                    : "Add photo"}
                </span>
              </label>
              <input
                id="post-image-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                style={{ display: "none" }}
                disabled={loading}
              />
            </div>
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
