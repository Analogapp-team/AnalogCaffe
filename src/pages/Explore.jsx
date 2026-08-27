import React, { useEffect, useState } from "react";
import Parse from "parse";
import ExploreUserItem from "../components/base-components/explore-user-item/ExploreUserItem";
import profilePicture from "../assets/images/ProfilePicture.png";
import { parseFileToUrl } from "../utils/Parse";
import { getFullName } from "../utils/User";


/* Explore page component - a page that displays a list of user profiles for discovery.
A page/container component that: Fetches and displays user profiles from the database
Provides user discovery functionality (browse other users), transforms raw user data into display-friendly format
Handles loading and error states gracefully*/ 

function Explore() {
  const [users, setUsers] = useState([]); // Array of user objects for display
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const q = new Parse.Query(Parse.User); // Queries the User class/table
    
    q.limit(7);
    q.descending("createdAt"); // Newest users first

    q.find()
      .then((results) => {
        if (!mounted) return; // Prevent state updates if unmounted

        // Transform Parse users to display objects
        const mapped = results.map((u) => ({
          id: u.id,
          userId: u.id,
          displayName: getFullName(u), // Formatted name "John D."
          desc: u.get("headline") || u.get("desc") || "",
          imgSrc:
            parseFileToUrl(u.get("profilePicture")) ||
            profilePicture,
        }));
        setUsers(mapped); //maps the constant above to Users
      })
      .catch((err) => {
        console.error("Failed to load users", err);
      })
      .finally(() => {
        if (mounted) setLoading(false); //stops loading again
      });

    return () => {
      mounted = false; //Cleanup that unmounts 
    };
  }, []); //Dependency array - Runs ONE time when the component first appears

  if (loading) return <div>Loading profiles…</div>; 

  return (
    <div>
      <div>
        <h2>Explore profiles!</h2>
        <div>Explore profiles you’re interested in!</div>
      </div>
      <br />
      <br />
      {users.map((u) => ( //Mapss users to ExploreUserItem components
        <ExploreUserItem
          key={u.id}
          imgSrc={u.imgSrc}
          userId={u.userId}
          displayName={u.displayName}
          desc={u.desc}
        />
      ))}
    </div>
  );
}

export default Explore;
