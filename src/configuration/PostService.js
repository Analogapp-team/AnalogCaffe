import Parse from "./Back4App";

export const createPost = async ({ content, images = [] }) => {
  try {
    const currentUser = Parse.User.current();
    if (!currentUser) throw new Error("No user logged in");

    const Post = Parse.Object.extend("Post");
    const post = new Post();

    // Always set content, even if it's empty string
    post.set("content", content || "");
    post.set("author", currentUser);

    console.log("Starting image upload process...");
    console.log("Images to upload:", images);
    console.log("Number of images:", images.length);

    // Handle image uploads if any
    if (images && images.length > 0) {
      console.log("Beginning image upload for", images.length, "images");

      const parseFiles = await Promise.all(
        images.map(async (file, index) => {
          try {
            console.log(`📸 Uploading image ${index + 1}:`, {
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
            });

            const parseFile = new Parse.File(file.name, file);
            console.log(
              `Parse.File created for image ${index + 1}:`,
              parseFile
            );

            await parseFile.save();
            console.log(
              `Image ${index + 1} uploaded successfully:`,
              parseFile.url()
            );

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

    return savedPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getPosts = async (options = {}) => {
  try {
    const query = new Parse.Query("Post");

    //author information
    query.include("author");

    // Sort by newest first
    query.descending("createdAt");

    // Limit results if needed
    if (options.limit) {
      query.limit(options.limit);
    }

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

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const query = new Parse.Query("Post");

    // Get the user object first
    const userQuery = new Parse.Query(Parse.User);
    const user = await userQuery.get(userId);

    // Query posts by this author
    query.equalTo("author", user);
    query.include("author");
    query.descending("createdAt");

    const posts = await query.find();
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const currentUser = Parse.User.current();
    if (!currentUser) throw new Error("No user logged in");

    const query = new Parse.Query("Post");
    query.include("author");
    const post = await query.get(postId);

    // Get current likes array or initialize empty array
    const likes = post.get("likes") || [];

    // Check if user already liked the post
    const userLikeIndex = likes.findIndex((like) => like === currentUser.id);

    if (userLikeIndex === -1) {
      likes.push(currentUser.id);
    } else {
      likes.splice(userLikeIndex, 1);
    }

    post.set("likes", likes);
    await post.save();

    return post;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const getPostLikes = async (postId) => {
  try {
    const query = new Parse.Query("Post");
    const post = await query.get(postId);
    return post.get("likes") || [];
  } catch (error) {
    console.error("Error getting post likes:", error);
    throw error;
  }
};

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

    await post.destroy();
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
