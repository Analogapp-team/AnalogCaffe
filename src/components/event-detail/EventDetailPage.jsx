// EventDetailPage is a PAGE / CONTAINER component
// Responsibility:
// - Fetch ONE event from backend
// - Manage local state
// - Handle join / leave logic
// - Pass derived data into JSX

import React, { useEffect, useState } from "react";
import "../event-detail/EventDetailPage.css";
import { useParams, Link } from "react-router-dom";
import {
  getEventById,
  joinEvent,
  leaveEvent,
} from "../../configuration/EventService";
import { useAuth } from "../../configuration/AuthContext";

function EventDetailPage() {
  // Read eventId from URL
  const { eventId } = useParams();

  // Logged-in user (global auth state)
  const { currentUser } = useAuth();

  // Local component state
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * =========================================
   * LOAD EVENT (side effect)
   * =========================================
   */
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const result = await getEventById(eventId);
        setEvent(result);
      } catch (err) {
        console.error("Error loading event:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  // Loading & error states
  if (loading) return <div>Loading event...</div>;
  if (!event) return <div>Event not found.</div>;

  /**
   * =========================================
   * DERIVED EVENT DATA (no state)
   * =========================================
   */

  const title = event.get("title") || "Untitled event";
  const description = event.get("description") || "";
  const date = event.get("date") || "Date TBA";
  const startTime = event.get("startTime") || "";
  const endTime = event.get("endTime") || "";
  const maxAttendees = event.get("maxAttendees") || 0;

  const participants = event.get("participants") || [];
  const participantCount = participants.length;

  const imageFile = event.get("image");
  const imageUrl = imageFile ? imageFile.url() : "/default-event.png";

 

  /**
   * =========================================
   * DERIVED BOOLEANS
   * =========================================
   */

  const isJoined =
    currentUser && participants.includes(currentUser.id);

  const isFull =
    maxAttendees > 0 && participantCount >= maxAttendees;

  /**
   * =========================================
   * EVENT HANDLERS
   * =========================================
   */

  const handleJoinLeave = async () => {
    try {
      if (isJoined) {
        await leaveEvent(eventId);
      } else {
        await joinEvent(eventId);
      }

      // Reload updated event from backend
      const updated = await getEventById(eventId);
      setEvent(updated);
    } catch (err) {
      console.error("Join/Leave error:", err);
    }
  };

  /**
   * =========================================
   * RENDER
   * =========================================
   */

  return (
    <div className="event-detail-page">
      {/* Back navigation */}
      <Link to="/events" className="event-back-link">
        ← Back to all events
      </Link>

      {/* Header */}
      <div className="event-detail-header">
        <img
          src={imageUrl}
          alt={title}
          className="event-detail-image"
        />

        <div className="event-detail-header-info">
          <h1 className="event-detail-title">{title}</h1>

          <div className="event-meta">
            <div className="event-meta-item">
              <span>{date}</span>
            </div>

            <div className="event-meta-item">
              <span>
                {startTime} – {endTime}
              </span>
            </div>
          </div>

        
        </div>

        {/* Attend / Leave button */}
        {currentUser && (
          <button
            className="event-attend-btn"
            onClick={handleJoinLeave}
            disabled={isFull && !isJoined}
          >
            {isJoined
              ? "Leave Event"
              : isFull
              ? "Full"
              : "Attend Event"}
          </button>
        )}
      </div>

      {/* About section */}
      <h2 className="event-section-title">About this event</h2>
      <p className="event-description">{description}</p>

      {/* Attendees */}
      <h2 className="event-attendees-title">
        Attendees{" "}
        {maxAttendees > 0
          ? `${participantCount} / ${maxAttendees}`
          : participantCount}
      </h2>
    </div>
  );
}

export default EventDetailPage;