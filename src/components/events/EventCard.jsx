// EventCard is a PRESENTATIONAL COMPONENT
// Responsibility:
// - Display ONE event
// - Expose user actions via callbacks (onJoin, onLeave, onDelete)
// - It does NOT manage state or talk to the backend

import "./EventCard.css";
import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import { useAuth } from "../../configuration/AuthContext";
import { useNavigate } from "react-router-dom";

function EventCard({ event, onJoin, onLeave, onDelete }) {
  // Global authentication state (who is logged in)
  const { currentUser } = useAuth();

  // React Router hook for navigation
  const navigate = useNavigate();

  /**
   * ADMIN CHECK (derived logic, no side effects)
   * Still present here because it controls UI visibility
   * (Delete button)
   */

  const ADMIN_EMAIL = "klobucnikadrian123@gmail.com";
  const ADMIN_ID = "PXrsjCliSR";

  const userEmail =
    currentUser?.get("email") || currentUser?.get("username") || "";

  const isAdmin =
    currentUser &&
    (currentUser.id === ADMIN_ID ||
      userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  /**
   * DERIVED EVENT DATA
   * Extract everything ONCE so JSX stays readable.
   */

  const title = event.get("title") || "Untitled event";
  const description = event.get("description") || "";
  const date = event.get("date") || "Date TBA";
  const startTime = event.get("startTime") || "";
  const endTime = event.get("endTime") || "";
  const maxAttendees = event.get("maxAttendees") || 0;

  // Participants are stored as user IDs
  const participants = event.get("participants") || [];
  const participantCount = participants.length;

  // Image handling (Parse files expose a url() method)
  const image = event.get("image");
  const imageUrl =
    image && typeof image.url === "function" ? image.url() : null;

  // User-friendly time string
  const timeDisplay =
    startTime && endTime
      ? `${startTime} - ${endTime}`
      : startTime || endTime || "Time TBA";

  // Derived booleans used for rendering and behavior
  const isJoined =
    currentUser && participants.includes(currentUser.id);

  const isFull =
    maxAttendees > 0 && participantCount >= maxAttendees;

  /**
   * EVENT HANDLERS (callbacks)
   * These functions DO NOT update state.
   * They notify the parent component via props.
   */

  const handleJoinClick = () => {
    if (isJoined) {
      onLeave && onLeave(event.id);
    } else {
      onJoin && onJoin(event.id);
    }
  };

  const handleDeleteClick = () => {
    if (!onDelete) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (confirmed) {
      onDelete(event.id);
    }
  };

  const handleViewClick = () => {
    navigate(`/events/${event.id}`);
  };

  /**
   * RENDER (JSX)
   * JSX now describes UI only,  no logic noise.
   */

  return (
    <div className="event-card">
      {/* Event image */}
      <img
        src={imageUrl || "/default-event.png"}
        alt={title}
        className="event-card__image"
      />

      {/* Main event content */}
      <div className="event-card__content">
        <h3 className="event-card__title">{title}</h3>
        <p className="event-card__desc">{description}</p>

        <div className="event-card__bottom">
          {/* Date */}
          <div className="event-card__info">
            <img
              src={calendarIcon}
              alt="calendar"
              className="event-card__icon"
            />
            <span>{date}</span>
          </div>

          {/* Time */}
          <div className="event-card__info">
            <img
              src={clockIcon}
              alt="clock"
              className="event-card__icon"
            />
            <span>{timeDisplay}</span>
          </div>

          {/* Attendees */}
          <div className="event-card__attendees">
            {maxAttendees > 0
              ? `${participantCount} / ${maxAttendees}`
              : `${participantCount} attending`}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="event-card__actions">
        <button
          className="ui-button ui-button--secondary"
          onClick={handleViewClick}
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
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default EventCard;