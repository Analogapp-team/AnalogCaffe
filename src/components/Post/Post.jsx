import React, { useState, useEffect } from "react";
import { likePost, deletePost } from "../../configuration/PostService";
import { useAuth } from "../../configuration/AuthContext";
import styles from "./post.module.css";

function Post({ post, onDelete }) {
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user liked this post and get like count
  useEffect(() => {
    if (post && currentUser) {
      const likes = post.get("likes") || [];
      setLikeCount(likes.length);
      setIsLiked(likes.some((like) => like === currentUser.id));
    }
  }, [post, currentUser]);

  const handleLike = async () => {
    try {
      const updatedPost = await likePost(post.id);
      const likes = updatedPost.get("likes") || [];
      setLikeCount(likes.length);
      setIsLiked(likes.some((like) => like === currentUser.id));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      if (onDelete) {
        onDelete(post.id);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if current user is the author of the post
  const isAuthor = currentUser && post?.get("author")?.id === currentUser.id;

  // Safe data extraction with error handling
  const getAuthorName = () => {
    if (!post) return "Unknown User";

    try {
      const author = post.get("author");
      if (!author) return "Unknown User";

      const firstName = author.get("firstName") || "";
      const lastName = author.get("lastName") || "";

      if (firstName && lastName) {
        return `${firstName} ${lastName.charAt(0)}.`;
      }
      return author.get("username") || "User";
    } catch (error) {
      console.error("Error getting author name:", error);
      return "Unknown User";
    }
  };

  const getAuthorProgram = () => {
    if (!post) return "Student";

    try {
      const author = post.get("author");
      return author?.get("studyCourse") || "MSc. Computer Science";
    } catch (error) {
      console.error("Error getting author program:", error);
      return "Student";
    }
  };

  const getProfilePicture = () => {
    if (!post) return "/default-avatar.png";

    try {
      const author = post.get("author");
      if (!author) return "/default-avatar.png";

      const profilePicture = author.get("profilePicture");

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

  const getRelativeTime = (createdAt) => {
    if (!createdAt) return "Recently";

    try {
      const now = new Date();
      const postDate = new Date(createdAt);
      const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
        return `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
      }
    } catch (error) {
      console.error("Error calculating relative time:", error);
      return "Recently";
    }
  };

  const getPostImages = () => {
    if (!post) return [];

    try {
      const images = post.get("images");
      console.log("Post images data:", images);

      if (images && Array.isArray(images)) {
        return images.map((image) => {
          if (image && typeof image.url === "function") {
            return image.url();
          }
          return image;
        });
      }
      return [];
    } catch (error) {
      console.error("Error getting post images:", error);
      return [];
    }
  };

  const getPostContent = () => {
    if (!post) return "Loading...";

    try {
      return post.get("content") || "";
    } catch (error) {
      console.error("Error getting post content:", error);
      return "Error loading content";
    }
  };

  // Don't render if post is undefined
  if (!post) {
    return (
      <div className={styles.post}>
        <div className={styles.postWrapper}>
          <div className={styles.loadingState}>Loading post...</div>
        </div>
      </div>
    );
  }

  const profilePictureUrl = getProfilePicture();
  const postContent = getPostContent();
  const postImages = getPostImages();

  console.log("🎯 Rendering post with:", {
    content: postContent,
    images: postImages,
    imageCount: postImages.length,
  });

  return (
    <div className={styles.post}>
      <div className={styles.postWrapper}>
        {/* Post Header */}
        <div className={styles.postTop}>
          <div className={styles.postTopLeft}>
            <img
              className={styles.postProfileImg}
              src={profilePictureUrl}
              alt=""
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className={styles.authorInfo}>
              <span className={styles.postUsername}>{getAuthorName()}</span>
              <span className={styles.postProgramme}>{getAuthorProgram()}</span>
              <span className={styles.postDate}>
                {getRelativeTime(post.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className={styles.postCenter}>
          {postContent && (
            <span className={styles.postText}>{postContent}</span>
          )}

          {/* Post Images */}
          {postImages.length > 0 && (
            <div className={styles.postImages}>
              {postImages.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Post image ${index + 1}`}
                  className={styles.postImage}
                  onError={(e) => {
                    console.error(
                      `❌ Failed to load image ${index + 1}:`,
                      imageUrl
                    );
                    e.target.style.display = "none";
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Post Actions - Like and Delete Buttons */}
        <div className={styles.postActions}>
          <button
            className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
            onClick={handleLike}
            disabled={!currentUser}
          >
            <span className={styles.likeIcon}>{isLiked ? "❤️" : "🤍"}</span>
            <span className={styles.likeCount}>{likeCount}</span>
          </button>

          {isAuthor && (
            <button
              className={styles.deleteButton}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "🗑️"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
