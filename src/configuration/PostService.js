import Parse from "./Back4App";
import { parseImagesToUrls } from "../utils/Parse";

// PostService handles creating, fetching, liking, and deleting posts. 
// Call these functions when making a component to interact with posts.

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
    post.set("user", currentUser);

    console.log("Setting user for post:", {
      userId: currentUser.id,
      username: currentUser.get("username"),
    });

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

    const query = new Parse.Query("Post");
    query.include("user");
    const completePost = await query.get(savedPost.id);

    console.log("Post saved successfully:", {
      id: completePost.id,
      content: completePost.get("content"),
      user: completePost.get("user"),
      images: savedPost.get("images"),
      userFirstName: completePost.get("user")?.get("firstName"),
      userLastName: completePost.get("user")?.get("lastName"),
    });

    // Return the saved post object
    return completePost;
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

    //user information
    query.include("user");

    // CRITICAL FIX: Select specific user fields to ensure they're fetched
    // Without this, user data might be incomplete
    query.select([
      "content",
      "images",
      "likes",
      "createdAt",
      "updatedAt",
      "user", // This ensures user pointer is included
      "user.firstName",
      "user.lastName",
      "user.username",
      "user.email",
      "user.profilePicture",
      "user.studyCourse",
      "user.bio",
    ]);

    // Sort by newest first
    query.descending("createdAt");

    // Limit results if needed
    if (options.limit) {
      query.limit(options.limit);
    }

    // Execute the query
    const posts = await query.find();

    // EXTENSIVE DEBUGGING
    console.log("=== POST FETCH DEBUG ===");
    console.log(`Total posts fetched: ${posts.length}`);

    if (posts.length === 0) {
      console.warn("No posts found!");
      return posts;
    }

    // Check each post's user data
    posts.forEach((post, index) => {
      const user = post.get("user");
      const postJson = post.toJSON();

      console.log(`\n--- Post ${index + 1} ---`);
      console.log("Post ID:", post.id);
      console.log("Content:", post.get("content")?.substring(0, 50) + "...");
      console.log("Created:", post.createdAt);
      console.log("Has 'user' field:", !!user);

      if (user) {
        console.log("User object found!");
        console.log("User ID:", user.id);
        console.log("User className:", user.className);
        console.log("User firstName:", user.get("firstName"));
        console.log("User lastName:", user.get("lastName"));
        console.log("User username:", user.get("username"));
        console.log("Has profilePicture:", !!user.get("profilePicture"));

        // Check if user object has all necessary data
        const userJson = user.toJSON();
        console.log("User JSON keys:", Object.keys(userJson));

        // If firstName/lastName are missing, try to fetch fresh
        if (!user.get("firstName") && !user.get("lastName")) {
          console.warn("User object missing name data!");
          console.log("Raw user data from post:", postJson.user);
        }
      } else {
        console.error("NO USER OBJECT FOUND!");
        console.log("Post JSON structure:", Object.keys(postJson));
        console.log("Post raw user field:", postJson.user);

        // Check for alternative user fields
        const possibleUserFields = Object.keys(postJson).filter(
          (key) =>
            key.toLowerCase().includes("user") ||
            key.toLowerCase().includes("author")
        );
        console.log("Possible user fields:", possibleUserFields);
      }
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

    query.equalTo("user", user);

    // Include user data
    query.include("user");
    query.select([
      "content",
      "images",
      "likes",
      "createdAt",
      "user.firstName",
      "user.lastName",
      "user.username",
      "user.profilePicture",
    ]);

    query.descending("createdAt");

    const posts = await query.find();

    console.log(`Fetched ${posts.length} posts for user ${userId}`);

    if (posts.length > 0) {
      const firstUser = posts[0].get("user");
      console.log("Sample user data:", {
        id: firstUser?.id,
        name: `${firstUser?.get("firstName")} ${firstUser?.get("lastName")}`,
        profilePic: !!firstUser?.get("profilePicture"),
      });
    }

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
    query.include("user");
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
    query.include("user");
    const post = await query.get(postId);

    // Check if current user is the author
    const postUser = post.get("user");
    if (!postUser || postUser.id !== currentUser.id) {
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
