import { useNavigate } from "react-router-dom";// React router's hook hook for programmatic navigation
import "./ExploreUserItem.css";

function ExploreUserItem({ imgSrc, userId, desc, displayName }) {
  const navigate = useNavigate();


  //Navigates to /profile/{userId} when a specific user exists
  // encodeURIComponent() safely encodes the userId for URLs
  const handleNavigate = () => {
    if (userId) {
      navigate(`/profile/${encodeURIComponent(userId)}`);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="userItem">
      <div
        className="userInfo"
        role="link"   // Treats the div as a link for screen readers
        tabIndex={0}  // Makes it focusable via keyboard
        aria-label={`Open profile of ${displayName || userId || "user"}`} // Provides descriptive text for screen readers
        onClick={handleNavigate}
        onKeyDown={(e) => {    // Allows triggering navigation with Enter or Space keys
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigate();
          }
        }}
      >
        <img src={imgSrc} alt="Profile" className="profileAvatar" />
        <div className="userDetails">
          <h3 className="userName">{displayName || userId}</h3>
          <p className="userDescription">{desc}</p>
        </div>
      </div>

      <button 
      className="seeProfileButton"
      type="button"
      title="See profile"
      onClick={handleNavigate}
      >
        See Profile
      </button>
    </div>
  );
}

export default ExploreUserItem;


//  USER EXPERIENCE FLOW

/*User sees a card with another user's info
Can click anywhere on the user info area OR the "See Profile" button
Both actions navigate to that user's profile page
Keyboard users can tab to the element and press Enter/Space*/ 
