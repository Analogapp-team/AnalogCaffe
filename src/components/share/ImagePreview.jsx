import React from "react";
import styles from "./share.module.css";

function ImagePreview({ preview, index, onRemove, disabled }) {
  return (
    <div className={styles.imagePreviewItem}> {/*Creates a wrapper/container element for a single image preview item.*/}
      <img
        src={preview.preview} // Sets the image source to a preview URL.
        alt={`Selected ${index + 1}`} 
        className={styles.previewImage} // Applies styling specifically to the image(CSS).
      />
      <button
        type="button"
        className={styles.removeImageButton}
        onClick={() => onRemove(index)}
        disabled={disabled}
        aria-label={`Remove selected image ${index + 1}`}
      >
        ×
      </button>
    </div>
  );
}

export default ImagePreview;
