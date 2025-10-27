import React, { createContext, useContext, useState } from "react";

// Create the context
const AuthContext = createContext();

// Hook to easily access the context
export function useAuth() {
  return useContext(AuthContext);
}

// Context provider
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // simulate login
  const login = () => {
    setIsAuthenticated(true);
  };

  // simulate logout
  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
