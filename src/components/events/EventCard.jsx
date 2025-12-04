import React from "react";
import "./EventCard.css";
import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";
import { useAuth } from "../../configuration/AuthContext";
import { useNavigate } from "react-router-dom";

function EventCard({ event, onJoin, onLeave, onDelete }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Checking if the current user is the admin (hardcoded for now)
  const ADMIN_EMAIL = "klobucnikadrian123@gmail.com";
  const ADMIN_ID = "PXrsjCliSR";

  const userEmail =
    currentUser?.get("email") || currentUser?.get("username") || "";

  const isAdmin =
    currentUser &&
    (currentUser.id === ADMIN_ID ||
      userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  // Pulling fields directly from the event object
  const title = event.get("title") || "Untitled event";
  const description = event.get("description") || "";
  const date = event.get("date") || "Date TBA";
  const startTime = event.get("startTime") || "";
  const endTime = event.get("endTime") || "";
  const maxAttendees = event.get("maxAttendees") || 0;

  // Participants is now an array of user IDs
  const participants = event.get("participants") || [];
  const participantCount = participants.length;

  // Event image handling
  const image = event.get("image");
  const imageUrl =
    image && typeof image.url === "function" ? image.url() : null;

  // Make the time display readable
  const timeDisplay =
    startTime && endTime
      ? `${startTime} - ${endTime}`
      : startTime || endTime || "Time TBA";

  // Check if this user already joined the event
  const isJoined =
    currentUser && participants.includes(currentUser.id);

  // Simple check to see if the event is full
  const isFull = maxAttendees > 0 && participantCount >= maxAttendees;

  // Join or leave the event depending on the current state
  const handleJoinClick = () => {
    if (isJoined) {
      onLeave && onLeave(event.id);
    } else {
      onJoin && onJoin(event.id);
    }
  };

  // Delete event, only shown for admin
  const handleDeleteClick = () => {
    if (!onDelete) return;
    if (window.confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id);
    }
  };

  // Navigate to event detail page
  const handleViewEvent = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="event-card">

      <img
        src={imageUrl || "/default-event.png"}
        alt={title}
        className="event-card__image"
      />

      {/* Main event info section */}
      <div className="event-card__content">
        <h3 className="event-card__title">{title}</h3>
        <p className="event-card__desc">{description}</p>

        <div className="event-card__bottom">

          {/* Event date */}
          <div className="event-card__info">
            <img
              src={calendarIcon}
              alt="calendar"
              className="event-card__icon"
            />
            <span>{date}</span>
          </div>

          {/* Event time */}
          <div className="event-card__info">
            <img src={clockIcon} alt="clock" className="event-card__icon" />
            <span>{timeDisplay}</span>
          </div>

          {/* Attendee counter */}
          <div className="event-card__attendees">
            <span className="event-card__attendees-icon"></span>
            {maxAttendees > 0
              ? `${participantCount} / ${maxAttendees}`
              : `${participantCount} attending`}
          </div>
        </div>
      </div>

      {/* Buttons for viewing, joining, leaving, or deleting */}
      <div className="event-card__actions">

        {/* NEW VIEW BUTTON — placed before the existing ones */}
        <button
          className="event-card__view"
          onClick={handleViewEvent}
        >
          View
        </button>

        {currentUser && (
          <button
            className="event-card__attend"
            onClick={handleJoinClick}
            disabled={isFull && !isJoined}
          >
            {isJoined ? "Leave" : isFull ? "Full" : "Attend"}
          </button>
        )}

        {isAdmin && (
          <button
            className="event-card__delete"
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