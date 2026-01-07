import React from "react";
import EventCard from "./EventCard";
import "./EventList.css";

/*
 * EventList component
 * - Display a list of events
 * - Render one EventCard per event
 */
function EventList({ events, isAdmin, onJoin, onLeave, onDelete }) {

  /*
   * Empty state handling
   *
   * If no events are passed (undefined or empty array),
   * show a fallback message instead of rendering cards.
   */
  if (!events || events.length === 0) {
    return <div>No events yet.</div>;
  }

  /*
   * Render event list
   *
   * - Uses Array.map to transform each event into an EventCard
   * - Passes down callbacks and permissions
   * - Each EventCard gets a unique key (required by React)
   */
  return (
    <div className="event-list">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isAdmin={isAdmin}
          onJoin={onJoin}
          onLeave={onLeave}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default EventList;