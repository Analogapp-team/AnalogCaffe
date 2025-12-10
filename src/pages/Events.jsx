import React, { useEffect, useState } from "react";
import { useAuth } from "../configuration/AuthContext";
import { getEvents, joinEvent, leaveEvent, deleteEvent } from "../configuration/EventService";
import EventList from "../components/events/EventList";
import CreateEventForm from "../components/events/CreateEventForm";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { currentUser } = useAuth();

  // Checking if the logged-in user is the admin (same check as everywhere else)
  const ADMIN_EMAIL = "klobucnikadrian123@gmail.com";
  const ADMIN_ID = "PXrsjCliSR";

  const userEmail =
    currentUser?.get("email") || currentUser?.get("username") || "";

  const isAdmin = currentUser && (
    currentUser.id === ADMIN_ID ||
    userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  // Deletes an event and updates the list on the page
  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      alert(err.message);
    }
  };

  // Load all events when the page loads
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const results = await getEvents();
        setEvents(results);
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Join an event and update UI
  const handleJoin = async (eventId) => {
    try {
      const updated = await joinEvent(eventId);
      setEvents(prev =>
        prev.map(e => (e.id === updated.id ? updated : e))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Leave an event and update UI
  const handleLeave = async (eventId) => {
    try {
      const updated = await leaveEvent(eventId);
      setEvents(prev =>
        prev.map(e => (e.id === updated.id ? updated : e))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="events-page">
      <h1>Events</h1>

      {/* Only the admin should see the create form */}
      {isAdmin && (
        <div className="event-list__create">
          <CreateEventForm />
        </div>
      )}

      {loading && <div>Loading events…</div>}
      {error && <div>{error}</div>}

      {/* Show the list when everything is loaded */}
      {!loading && !error && (
        <EventList
          events={events}
          onJoin={handleJoin}
          onLeave={handleLeave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Events;
