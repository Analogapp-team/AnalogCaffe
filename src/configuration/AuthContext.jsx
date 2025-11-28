import React, { createContext, useContext, useState, useEffect } from "react";
import Parse from "./Back4App";

// Creates a react context object that can store authentication states and methods (currentUser, login, logout, isAuthenticated etc)
const AuthContext = createContext();

// Just so we don't need to import useContext and AuthContext every time
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component that wraps the app and provides authentication context. 
// Speaks with Back4App through Parse to manage user authentication.
function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if user is already logged in
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = await Parse.User.currentAsync();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error checking current user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();
  }, []);

  // Login function to authenticate user with "email" and "password"
  const login = async (email, password) => {
    try {
      const user = await Parse.User.logIn(email, password);
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register function to create a new user with provided userData
  const register = async (userData) => {
    try {
      const user = new Parse.User();
      user.set("firstName", userData.firstName);
      user.set("lastName", userData.lastName);
      user.set("email", userData.email);
      user.set("password", userData.password);

      const newUser = await user.signUp();
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function to log out the current user
  const logout = async () => {
    try {
      await Parse.User.logOut();
      setCurrentUser(null);
    } catch (error) {
      console.error("Error while logging out user:", error);
    }
  };

  // Refresh user globally (fixes avatar updates)
  const refreshCurrentUser = async () => {
    try {
      let user = Parse.User.current();
      if (!user) return null;

      user = await user.fetch();  
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Error refreshing current user:", error);
    }
  };

  // Context value containing authentication state and methods
  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    refreshCurrentUser,
  };

  // Provide the authentication context to child components
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;