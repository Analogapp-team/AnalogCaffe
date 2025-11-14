import React from "react";
import "./EventCard.css";
import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";

const EventCard = ({ event }) => {
  // Combine start and end times for display
  const timeDisplay =
    event.startTime && event.endTime
      ? `${event.startTime} - ${event.endTime}`
      : event.startTime || event.endTime || "Time Not Specified";

  return (
    <div className="event-card">
      {/* Left image */}
      <img src={event.image} alt={event.title} className="event-card__image" />

      {/* Middle content */}
      <div className="event-card__content">
        <h3 className="event-card__title">{event.title}</h3>
        <p className="event-card__desc">{event.description}</p>

        <div className="event-card__bottom">
          <div className="event-card__info">
            <img
              src={calendarIcon}
              alt="calendar"
              className="event-card__icon"
            />
            <span>{event.date || "Date TBA"}</span>
          </div>
          <div className="event-card__info">
            <img src={clockIcon} alt="clock" className="event-card__icon" />
            <span>{timeDisplay}</span>
          </div>
        </div>
      </div>

      {/* Right action area */}
      <div className="event-card__actions">
        <button className="event-card__attend">Attend</button>
        <div className="event-card__attendees">
          <span className="event-card__attendees-icon"></span>{" "}
          {event.attendees || "0 attending"}
        </div>
      </div>
    </div>
  );
};

export default EventCard;