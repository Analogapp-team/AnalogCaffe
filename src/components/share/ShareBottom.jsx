import React from "react";
import styles from "./share.module.css";
import image from "../../assets/icons/image.svg";

function ShareBottom({ images, loading, onImageSelect, onPost, content }) {
  return (
    <div className={styles.shareBottom}>
      <div className={styles.shareOptions}>
        <label htmlFor="post-image-input" className={styles.fileInputLabel}>
          <img
            className={styles.shareIcon}
            src={image}
            alt=""
            aria-hidden="true"
          />
          <span className={styles.shareOptionText}>
            {images.length > 0 ? `${images.length} photo(s)` : "Add photo"}
          </span>
        </label>
        <input
          id="post-image-input"
          type="file"
          accept="image/*"
          multiple
          onChange={onImageSelect}
          disabled={loading}
          style={{ display: "none" }}
        />
      </div>

      <button
        className={styles.shareButton}
        onClick={onPost}
        disabled={loading || (!content.trim() && images.length === 0)}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
}

export default ShareBottom;
