import React from "react";
import styles from "./share.module.css";
import image from "../../assets/icons/image.svg";


/* A dual-function toolbar component that provides:
   Image attachment controls (add/indicate photos)
   Post submission button with validation
   Accessible file input handling
   Visual feedback for current state ("Add photo", "Post")
*/

function ShareBottom({ images, loading, onImageSelect, onPost, content, fileInputRef }) {
  return (
    <div className={styles.shareBottom}>
      <div className={styles.shareOptions}>
        {/* Custom-styled label that acts as a button */}
        <label
          htmlFor="post-image-input"
          className={styles.fileInputLabel}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              // Prevent default scroll behavior for spacebar
              e.preventDefault(); 
              // Use the ref to click the input safely
              fileInputRef.current?.click();
            }
          }}
        >
          {/* Image icon */}
          <img
            className={styles.shareIcon}
            src={image}
            alt="" // Empty alt because text label provides context
            aria-hidden="true"
          />
          {/* Dynamic text based on image count */}
          <span className={styles.shareOptionText}>
            {images.length > 0 ? `${images.length} photo(s)` : "Add photo"}
          </span>
        </label>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          id="post-image-input"
          type="file"
          accept="image/*"
          multiple
          onChange={onImageSelect} // Parent handles file processing
          disabled={loading} // Can't add images while posting
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
