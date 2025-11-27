import React from "react";
import ProfileAvatar from "../profile-header/ProfileAvatar";
import styles from "./share.module.css";
import ImagePreview from "./ImagePreview";

function ShareTop({ user, content, setContent, loading, imagePreviews, removeImage }) {
  return (
    <div className={styles.shareTop}>
      <div className={styles.shareProfileImgWrapper}>
        {user && <ProfileAvatar user={user} size={40} />}
      </div>

      <textarea
        placeholder="What's in your mind?"
        className={styles.shareInput}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        rows="3"
      />

      {/* Image previews */}
      {imagePreviews && imagePreviews.length > 0 && (
        <div className={styles.imagePreviews}>
          {imagePreviews.map((preview, index) => (
            <ImagePreview
              key={index}
              preview={preview}
              index={index}
              onRemove={removeImage}
              disabled={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ShareTop;
