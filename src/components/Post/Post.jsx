import React, { useState, useEffect } from "react";
import {
  likePost,
  deletePost,
  extractPostContent,
  extractPostImages,
} from "../../configuration/PostService";
import { useAuth } from "../../configuration/AuthContext";
import styles from "./post.module.css";
import ProfileAvatar from "../profile-header/ProfileAvatar";
import { formatRelativeTime } from "../../utils/Time";

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
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      if (onDelete) onDelete(post.id);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Get the author object from the USER column (not author)
  const author = post?.get("user");

  // Check if current user is the author of the post
  const isAuthor = currentUser && author?.id === currentUser.id;

  // SIMPLIFIED AUTHOR DISPLAY LOGIC - NO FORMER USER LOGIC
  const getAuthorName = () => {
    if (!author) return "Unknown User";
    try {
      // Get the actual name data with trimming
      const firstName = author.get("firstName")?.trim(); // FIXED: Added parentheses ()
      const lastName = author.get("lastName")?.trim(); // FIXED: Added parentheses ()

      console.log("Name debug:", { firstName, lastName });

      if (firstName && lastName) {
        return `${firstName} ${lastName.charAt(0)}.`;
      }

      if (firstName) {
        return firstName;
      }

      if (lastName) {
        return lastName;
      }

      const username = author.get("username");
      if (username) {
        return username;
      }

      return "Unknown User";
    } catch (error) {
      console.error("Error getting author name:", error);
      return "Unknown User"; // Changed from "Former User"
    }
  };

  const getAuthorProgram = () => {
    if (!author) return "Student";
    try {
      // Simply return the study course
      return author.get("studyCourse")?.trim() || "Student";
    } catch {
      return "Student";
    }
  };

  // SIMPLIFIED PROFILE AVATAR HANDLER - NO FORMER USER LOGIC
  const getAuthorForAvatar = () => {
    if (!author) return null;
    try {
      // Always return the actual author
      return author;
    } catch {
      return null;
    }
  };

  const getPostImages = () => extractPostImages(post);
  const getPostContent = () => extractPostContent(post);

  if (!post) {
    return (
      <div className={styles.post}>
        <div className={styles.postWrapper}>
          <div className={styles.loadingState}>Loading post...</div>
        </div>
      </div>
    );
  }

  const postContent = getPostContent();
  const postImages = getPostImages();
  const authorForAvatar = getAuthorForAvatar();

  return (
    <div className={styles.post}>
      <div className={styles.postWrapper}>
        {/* Post Header */}
        <div className={styles.postTop}>
          <div className={styles.postTopLeft}>
            <ProfileAvatar user={authorForAvatar} size={40} />

            <div className={styles.authorInfo}>
              <span className={styles.postUsername}>{getAuthorName()}</span>
              <span className={styles.postDate}>
                {formatRelativeTime(post.createdAt)}
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
                  alt={postContent ? postContent.slice(0, 120) : ""}
                  loading="lazy"
                  className={styles.postImage}
                  onError={(e) => (e.target.style.display = "none")}
                />
              ))}
            </div>
          )}
        </div>

        {/* Post Actions */}
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
