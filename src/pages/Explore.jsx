import React, { useEffect, useState } from "react";
import Parse from "parse";
import ExploreUserItem from "../components/base-components/explore-user-item/ExploreUserItem";
import profilePicture from "../assets/images/ProfilePicture.png";
import { parseFileToUrl } from "../utils/Parse";
import { getFullName } from "../utils/User";

function Explore() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const q = new Parse.Query(Parse.User);
    
    q.limit(7);
    q.descending("createdAt"); 

    q.find()
      .then((results) => {
        if (!mounted) return; //Prevents memory leak if component unmounts before fetch completes
        const mapped = results.map((u) => ({ //Mapps Parse.User data to ExploreUserItem props
          id: u.id,
          userId: u.id,
          displayName: getFullName(u),
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
