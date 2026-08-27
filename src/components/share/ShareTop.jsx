import React from "react";
import ProfileAvatar from "../profile-header/ProfileAvatar";
import styles from "./share.module.css";
import ImagePreview from "./ImagePreview";

/* A component that provides:
   User identity display (profile avatar)
   Text input area for post content
   Image preview display for attached files
   Loading state management across all inputs
*/ 
function ShareTop({
  user,
  content,
  setContent,
  loading,
  imagePreviews,
  removeImage,
}) {
  return (
    <div className={styles.shareTop}>
      {/* Left: Profile Avatar */}
      <div className={styles.shareProfileImgWrapper}>
        {user && <ProfileAvatar user={user} size={40} />}
      </div>

      {/* Center: Text Input */}
      <textarea
        placeholder="What's on your mind?"
        className={styles.shareInput}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        rows="1"
      />

      {/* Bottom: Image Previews */}
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
