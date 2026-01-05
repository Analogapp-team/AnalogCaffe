import { useNavigate } from "react-router-dom";
import "./ExploreUserItem.css";

function ExploreUserItem({ imgSrc, userId, desc, displayName }) {
  const navigate = useNavigate();

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
        role="link"
        tabIndex={0}
        aria-label={`Open profile of ${displayName || userId || "user"}`}
        onClick={handleNavigate}
        onKeyDown={(e) => {
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
      role="switch"
      title="See profile"
      >
        See Profile
    </button>
    </div>
  );
}

export default ExploreUserItem;
