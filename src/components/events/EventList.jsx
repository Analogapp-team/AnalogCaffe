import React from "react";
import EventCard from "./EventCard";
import "./EventList.css";

function EventList({ events, onJoin, onLeave, onDelete }) {
  if (!events || events.length === 0) {
    return <div>No events yet.</div>;
  }

  return (
    <div className="event-list">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onJoin={onJoin}
          onLeave={onLeave}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default EventList;