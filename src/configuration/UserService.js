// src/configuration/UserService.js
import Parse from "./Back4App";

// 🔥 Utility: Get current user or throw
const getUserOrThrow = () => {
  const user = Parse.User.current();
  if (!user) throw new Error("No user logged in");
  return user;
};

// 🔥 Utility: Save user and return fresh version
const saveAndRefresh = async (user) => {
  await user.save();
  return await user.fetch();
};

// ======================================================
// PUBLIC FUNCTIONS
// ======================================================

// Always returns FRESH user object
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

// Update user fields and return the FRESH user
export const updateUserProfile = async (updates) => {
  try {
    const user = getUserOrThrow();

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) user.set(key, value);
    });

    return await saveAndRefresh(user);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Upload profile picture and return FRESH user
export const uploadProfilePicture = async (file) => {
  try {
    const user = getUserOrThrow();

    const parseFile = new Parse.File(file.name, file);
    await parseFile.save();

    user.set("profilePicture", parseFile);
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
    user.unset("profilePicture");

    return await saveAndRefresh(user);
  } catch (error) {
    console.error("Error removing profile picture:", error);
    throw error;
  }
};