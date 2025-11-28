import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./configuration/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/home/Home";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import MainLayout from "./layouts/MainLayout";
import ProfileSettings from "./pages/ProfileSettings";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <Route element={<MainLayout />}> {/*Protected routes wrapped in MainLayout */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} /> {/* Victor use this router for the explore profiles page (you were right) */}
            <Route path="/profile/settings" element={<ProfileSettings />} />
            <Route path="/Events" element={<Events />} />
          </Route>
        ) : (
          // Redirect all other routes to login if not authenticated
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
