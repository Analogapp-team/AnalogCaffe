// src/configuration/UserService.js
import Parse from "./Back4App";

// Get current user or throw error
const getUserOrThrow = () => {
  const user = Parse.User.current();
  if (!user) throw new Error("No user logged in");
  return user;
};

// Save user and return fresh version
const saveAndRefresh = async (user) => {
  await user.save();
  return await user.fetch();
};

// ======================================================
// PUBLIC FUNCTIONS
// ======================================================

// Get the current logged-in user's profile (fresh Parse.User)
export const getCurrentUserProfile = async () => {
  try {
    const user = getUserOrThrow();
    return await user.fetch();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Fetch a user by objectId (id) - returns a fresh Parse.User
export const getUserById = async (userId) => {
  try {
    const q = new Parse.Query(Parse.User);
    const user = await q.get(userId);
    return await user.fetch();
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
};

// Update user fields and return the fresh user
export const updateUserProfile = async (updates) => {
  try {
    const user = getUserOrThrow();

    // Apply updates to user object
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) user.set(key, value);
    });

    // Save and return fresh user object
    return await saveAndRefresh(user);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Upload profile picture and return fresh user
export const uploadProfilePicture = async (file) => {
  try {
    const user = getUserOrThrow();

    // Create Parse.File object for the profile picture
    const parseFile = new Parse.File(file.name, file);
    await parseFile.save();

    // Set the profile picture field on the user object
    user.set("profilePicture", parseFile);

    // Save and return fresh user object
    return await saveAndRefresh(user);
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

// Remove profile picture and return FRESH user
export const removeProfilePicture = async () => {
  try {
    const user = getUserOrThrow();

    // "Unset" the profile picture field
    user.unset("profilePicture");

    // Save and return fresh user object
    return await saveAndRefresh(user);
  } catch (error) {
    console.error("Error removing profile picture:", error);
    throw error;
  }
};
