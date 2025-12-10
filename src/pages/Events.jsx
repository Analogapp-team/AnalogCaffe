// Events page (PAGE / CONTAINER component)
//
// Responsibility:
// - Fetch events from backend
// - Hold page-level state
// - Handle side effects (join, leave, delete)
// - Determine admin role (UI only)
// - Pass callbacks + data to child components

import React, { useEffect, useState } from "react";
import { useAuth } from "../configuration/AuthContext";
import {
  getEvents,
  joinEvent,
  leaveEvent,
  deleteEvent,
} from "../configuration/EventService";
import EventList from "../components/events/EventList";
import CreateEventForm from "../components/events/CreateEventForm";
import { isUserAdmin } from "../utils/roles";

function Events() {
  const { currentUser } = useAuth();

  /**
   * PAGE STATE
   */
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * ADMIN ROLE (UI ONLY)
   * Same logic as EventDetailPage
   */
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * LOAD EVENTS (on mount)
   */
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const results = await getEvents();
        setEvents(results);
      } catch (err) {
        console.error("Failed to load events:", err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  /**
   * CHECK ADMIN ROLE (on user change)
   */
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      try {
        const admin = await isUserAdmin(currentUser);
        setIsAdmin(admin);
      } catch (err) {
        console.error("Admin role check failed:", err);
        setIsAdmin(false);
      }
    };

    checkAdminRole();
  }, [currentUser]);

  /**
   * EVENT HANDLERS (SIDE EFFECTS)
   */

const handleDelete = async (eventId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this event?"
  );

  if (!confirmed) return;

  try {
    await deleteEvent(eventId);

    setEvents((prev) =>
      prev.filter((e) => e.id !== eventId)
    );
  } catch (err) {
    console.error("Delete failed:", err);
    alert(err.message || "Failed to delete event.");
  }
};

  const handleJoin = async (eventId) => {
    try {
      const updated = await joinEvent(eventId);

      setEvents((prev) =>
        prev.map((e) =>
          e.id === updated.id ? updated : e
        )
      );
    } catch (err) {
      console.error("Join failed:", err);
      alert(err.message || "Could not join event.");
    }
  };

  const handleLeave = async (eventId) => {
    try {
      const updated = await leaveEvent(eventId);

      setEvents((prev) =>
        prev.map((e) =>
          e.id === updated.id ? updated : e
        )
      );
    } catch (err) {
      console.error("Leave failed:", err);
      alert(err.message || "Could not leave event.");
    }
  };

  /**
   * RENDER
   */
  return (
    <div className="events-page">
      <h1>Events</h1>

      {/* Admin-only UI */}
      {isAdmin && <CreateEventForm />}

      {loading && <div>Loading events…</div>}
      {error && <div>{error}</div>}

      {!loading && !error && (
        <EventList
          events={events}
          isAdmin={isAdmin}
          onJoin={handleJoin}
          onLeave={handleLeave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Events;
