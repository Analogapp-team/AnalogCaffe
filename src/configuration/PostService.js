import Parse from "./Back4App";
import { parseImagesToUrls } from "../utils/Parse";

// PostService handles creating, fetching, liking, and deleting posts. Call these functions when making a component to interact with posts.

// createPost creates a new post with optional images.
export const createPost = async ({ content, images = [] }) => {
  try {
    // Get current user
    const currentUser = Parse.User.current();
    if (!currentUser) throw new Error("No user logged in");

    // Create new Post object
    const Post = Parse.Object.extend("Post");
    const post = new Post();

    // Always set content, even if it's an empty string
    post.set("content", content || "");
    post.set("author", currentUser);

    console.log("Starting image upload process...");
    console.log("Images to upload:", images);
    console.log("Number of images:", images.length);

    // Handle image uploads if any (as it is optional)
    if (images && images.length > 0) {
      console.log("Beginning image upload for", images.length, "images");

      // Upload each image and collect Parse.File objects
      const parseFiles = await Promise.all(
        images.map(async (file, index) => {
          try {
            console.log(`📸 Uploading image ${index + 1}:`, {
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
            });

            // Create Parse.File object for the image
            const parseFile = new Parse.File(file.name, file);
            console.log(
              `Parse.File created for image ${index + 1}:`,
              parseFile
            );

            // Save the file to Back4App 
            await parseFile.save();
            console.log(
              `Image ${index + 1} uploaded successfully:`,
              parseFile.url()
            );

            // Return the Parse.File object for this image
            return parseFile;
          } catch (fileError) {
            console.error(`Error uploading image ${index + 1}:`, fileError);
            throw fileError;
          }
        })
      );

      console.log("All images uploaded successfully:", parseFiles);
      console.log(
        "Setting images field on post:",
        parseFiles.map((f) => f.url())
      );

      // Set the images field on the post with the uploaded Parse.File objects
      post.set("images", parseFiles);
    } else {
      console.log("ℹ️ No images to upload");
    }

    console.log("Saving post to database...");
    const savedPost = await post.save();

    console.log("Post saved successfully:", {
      id: savedPost.id,
      content: savedPost.get("content"),
      images: savedPost.get("images"),
      hasImages: !!savedPost.get("images"),
      imageCount: savedPost.get("images") ? savedPost.get("images").length : 0,
    });

    // Return the saved post object
    return savedPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Fetch posts with author info, sorted by newest first
export const getPosts = async (options = {}) => {
  try {
    // Create a new query for posts
    const query = new Parse.Query("Post");

    //author information
    query.include("author");

    // Sort by newest first
    query.descending("createdAt");

    // Limit results if needed
    if (options.limit) {
      query.limit(options.limit);
    }

    // Execute the query to fetch posts
    const posts = await query.find();

    // Debug the fetched posts
    console.log("📥 Fetched posts:", posts.length);
    posts.forEach((post, index) => {
      console.log(`📖 Post ${index + 1}:`, {
        id: post.id,
        content: post.get("content"),
        hasImages: !!post.get("images"),
        images: post.get("images"),
        imageCount: post.get("images") ? post.get("images").length : 0,
      });
    });

    // Return the fetched posts
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Fetch posts by a specific user (used when viewing profile pages)
export const getUserPosts = async (userId) => {
  try {
    // Create a new query for posts (same as before)
    const query = new Parse.Query("Post");

    // Get the user object first
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId);

    // Query posts by this author
    query.equalTo("author", user);
    query.include("author");
    query.descending("createdAt");

    // Use query to fetch posts
    const posts = await query.find();
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

// Like or unlike a post states
export const likePost = async (postId) => {
  try {
    // Get the current logged-in user
    const currentUser = Parse.User.current();
    if (!currentUser) throw new Error("No user logged in");

    // Create a new query for posts
    const query = new Parse.Query("Post");
    query.include("author");
    const post = await query.get(postId);

    // Get current likes array or initialize empty array
    const likes = post.get("likes") || [];

    // Check if user already liked the post
    const userLikeIndex = likes.findIndex((like) => like === currentUser.id);

    // Toggle like status
    if (userLikeIndex === -1) {
      likes.push(currentUser.id);
    } else {
      likes.splice(userLikeIndex, 1);
    }

    // Update the likes count on the post
    post.set("likes", likes);
    await post.save();

    // Return the updated post object
    return post;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// Get likes for a specific post
export const getPostLikes = async (postId) => {
  try {
    const query = new Parse.Query("Post");
    const post = await query.get(postId);

    // Return the likes array or an empty array if none
    return post.get("likes") || [];
  } catch (error) {
    console.error("Error getting post likes:", error);
    throw error;
  }
};

// Delete a post (first few lines is a repeat from above)
export const deletePost = async (postId) => {
  try {
    const currentUser = Parse.User.current();
    if (!currentUser) throw new Error("No user logged in");

    const query = new Parse.Query("Post");
    query.include("author");
    const post = await query.get(postId);

    // Check if current user is the author
    const author = post.get("author");
    if (author.id !== currentUser.id) {
      throw new Error("Not authorized to delete this post");
    }

    // Finaly delete the post
    await post.destroy();
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Extract content from a post object
export const extractPostContent = (post) => {
  if (!post) return "";
  try {
    return post.get("content") || "";
  } catch {
    return "";
  }
};

// Extract images from a post object
export const extractPostImages = (post) => {
  if (!post) return [];
  try {
    // Get images array from the post object
    const images = post.get("images");
    return parseImagesToUrls(images);
  } catch {
    return [];
  }
};
