import Parse from "./Back4App";

export const getCurrentUserProfile = async () => {
  try {
    const currentUser = Parse.User.current();
    if (!currentUser) throw new Error("No user logged in");

    // Fetch fresh user data from server
    const user = await currentUser.fetch();
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (updates) => {
  try {
    const currentUser = Parse.User.current();
    if (!currentUser) throw new Error("No user logged in");

    // Update fields
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        currentUser.set(key, updates[key]);
      }
    });

    await currentUser.save();
    return currentUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const uploadProfilePicture = async (file) => {
  try {
    const parseFile = new Parse.File(file.name, file);
    await parseFile.save();

    const currentUser = Parse.User.current();
    currentUser.set("profilePicture", parseFile);
    await currentUser.save();

    return parseFile.url();
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

export const removeProfilePicture = async () => {
  try {
    const currentUser = Parse.User.current();
    currentUser.unset("profilePicture");
    await currentUser.save();
    return true;
  } catch (error) {
    console.error("Error: removing profile picture:", error);
    throw error;
  }
};
