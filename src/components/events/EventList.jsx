import React, { useState } from "react";
import EventCard from "./EventCard";
import CreateEventForm from "./CreateEventForm";
import mockEvents from "./data/mockEvents";
import "./EventList.css";

const EventList = () => {
  const [events, setEvents] = useState(mockEvents);
  const isAdmin = true; // later connect this to AuthContext

  const handleCreateEvent = (newEvent) => {
  const newEventObj = {
    id: events.length + 1,
    title: newEvent.title || "Untitled Event",
    description: newEvent.description || "",
    date: newEvent.date || "TBA",
    startTime: newEvent.startTime || "",
    endTime: newEvent.endTime || "",
    maxAttendees: newEvent.maxAttendees || 100,
    attendees: `0/${newEvent.maxAttendees || 100} attending`,
    image: newEvent.image
      ? URL.createObjectURL(newEvent.image)
      : "/placeholder.png",
  };

  setEvents([newEventObj, ...events]);
};

  return (
    <div className="event-list">
      <h1 className="event-list__title">Events</h1>
      <p className="event-list__subtitle">
        Discover what's happening in Analog.
      </p>

      {/* Admin-only Create Event form (now appears first) */}
      {isAdmin && (
        <div className="event-list__create">
          <CreateEventForm onCreate={handleCreateEvent} />
        </div>
      )}

      {/* Event list below the form */}
      <div className="event-list__cards">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;