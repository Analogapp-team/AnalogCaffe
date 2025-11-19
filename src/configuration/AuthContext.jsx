import React, { createContext, useContext, useState, useEffect } from "react";
import Parse from "./Back4App";

const AuthContext = createContext();

// Hook to easily access the context
export function useAuth() {
  return useContext(AuthContext);
}

// Context provider
function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = await Parse.User.currentAsync();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error: checking current user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();
  }, []);

  //Login function
  const login = async (email, password) => {
    try {
      const user = await Parse.User.logIn(email, password);
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      console.error("Error: while logging in user:", error);
      return { success: false, error: error.message };
    }
  };

  //Register function
  const register = async (userData) => {
  try {
    const user = new Parse.User();

    user.set("username", `${userData.firstName} ${userData.lastName}`);
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


  //Logout function
  const logout = async () => {
    try {
      await Parse.User.logOut();
      setCurrentUser(null);
    } catch (error) {
      console.error("Error while logging out user:", error);
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
