import React from "react";
import styles from "./share.module.css";

function ImagePreview({ preview, index, onRemove, disabled }) {
  return (
    <div className={styles.imagePreviewItem}>
      <img
        src={preview.preview}
        alt={`Selected ${index + 1}`}
        className={styles.previewImage}
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
