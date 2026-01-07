import "./EventCard.css";
import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import { useAuth } from "../../configuration/AuthContext";
import { useNavigate } from "react-router-dom";

/*
 * EventCard component
 *
 * Purpose:
 * - Display a single event preview
 * - Allow users to join/leave
 * - Allow admins to delete
 */
function EventCard({ event, isAdmin, onJoin, onLeave, onDelete }) {
  /**
   * Get current logged-in user from AuthContext
   */
  const { currentUser } = useAuth();

  /*
   * Used to navigate to event detail page
   */
  const navigate = useNavigate();

  /*
   * Read event fields from Parse.Object
   */
  const title = event.get("title");
  const description = event.get("description");
  const date = event.get("date");
  const startTime = event.get("startTime");
  const endTime = event.get("endTime");
  const maxAttendees = event.get("maxAttendees") || 0;

  /*
   * Participants array
   * Stored as array of userId strings
   */
  const participants = event.get("participants") || [];
  const participantCount = participants.length;

  /*
   * Event image handling
   */
  const image = event.get("image");
  const imageUrl = image?.url?.() ?? "/default-event.png";

  /*
   * Check if current user is already joined
   */
  const isJoined =
    currentUser && participants.includes(currentUser.id);

  /*
   * Check if event has reached capacity
   */
  const isFull =
    maxAttendees > 0 && participantCount >= maxAttendees;

  /*
   * Handle join / leave button click
   * Delegates logic to parent via callbacks
   */
  const handleJoinClick = () => {
    isJoined ? onLeave(event.id) : onJoin(event.id);
  };

  /*
   * Utility: shorten long descriptions for card view
   */
  const truncateText = (text, maxLength = 125) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.slice(0, maxLength) + "…"
      : text;
  };

  return (
    <div className="event-card">
      <img src={imageUrl} alt={title} className="event-card__image" />

      <div className="event-card__content">
        <h3>{title}</h3>
        <p>{truncateText(description)}</p>

        <div className="event-card__bottom">
          <div>
            <img src={calendarIcon} alt="" /> {date}
          </div>
          <div>
            <img src={clockIcon} alt="" /> {startTime} – {endTime}
          </div>
          <div>
            {participantCount} / {maxAttendees || "∞"}
          </div>
        </div>
      </div>

      <div className="event-card__actions">
        <button
          className="ui-button ui-button--secondary"
          onClick={() => navigate(`/events/${event.id}`)}
        >
          View
        </button>

        {currentUser && (
          <button
            className="ui-button ui-button--primary"
            onClick={handleJoinClick}
            disabled={isFull && !isJoined}
          >
            {isJoined ? "Leave" : isFull ? "Full" : "Attend"}
          </button>
        )}

        {isAdmin && (
          <button
            className="ui-button ui-button--danger"
            onClick={() => onDelete(event.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default EventCard;