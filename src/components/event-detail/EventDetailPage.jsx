// EventDetailPage is a PAGE / CONTAINER component
// Responsibility:
// - Fetch ONE event from backend
// - Manage local state
// - Handle join / leave logic
// - Allow admin to edit event (minimal)
// - Pass derived data into JSX

import React, { useEffect, useState } from "react";
import "../event-detail/EventDetailPage.css";
import { useParams, Link } from "react-router-dom";
import {
  getEventById,
  joinEvent,
  leaveEvent,
  updateEvent,
} from "../../configuration/EventService";
import { useAuth } from "../../configuration/AuthContext";

function EventDetailPage() {
  const { eventId } = useParams();
  const { currentUser } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
  });

  /**
   * LOAD EVENT
   */
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const result = await getEventById(eventId);
        setEvent(result);

        setEditData({
          title: result.get("title") || "",
          description: result.get("description") || "",
        });
      } catch (err) {
        console.error("Error loading event:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  if (loading) return <div>Loading event...</div>;
  if (!event) return <div>Event not found.</div>;

  /**
   * DERIVED DATA
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

  const isJoined =
    currentUser && participants.includes(currentUser.id);

  const isFull =
    maxAttendees > 0 && participantCount >= maxAttendees;

  /**
   * ADMIN CHECK (UI ONLY)
   */
  const ADMIN_ID = "PXrsjCliSR";
  const ADMIN_EMAIL = "klobucnikadrian123@gmail.com";

  const userEmail =
    currentUser?.get("email") || currentUser?.get("username") || "";

  const isAdmin =
    currentUser &&
    (currentUser.id === ADMIN_ID ||
      userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  /**
   * EVENT HANDLERS
   */
  const handleJoinLeave = async () => {
    try {
      if (isJoined) {
        await leaveEvent(eventId);
      } else {
        await joinEvent(eventId);
      }

      const updated = await getEventById(eventId);
      setEvent(updated);
    } catch (err) {
      console.error("Join/Leave error:", err);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateEvent(eventId, editData);
      const updated = await getEventById(eventId);
      setEvent(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  /**
   * RENDER
   */
  return (
    <div className="event-detail-page">
      <Link to="/events" className="event-back-link">
        ← Back to all events
      </Link>

      <div className="event-detail-header">
        <img
          src={imageUrl}
          alt={title}
          className="event-detail-image"
        />

        <div className="event-detail-header-info">
          {isEditing ? (
            <input
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />
          ) : (
            <h1 className="event-detail-title">{title}</h1>
          )}

          <div className="event-meta">
            <span>{date}</span>
            <span>
              {startTime} – {endTime}
            </span>
          </div>
        </div>

        {currentUser && !isEditing && (
          <button
            className="ui-button ui-button--primary"
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

      <h2 className="event-section-title">About this event</h2>

      {isEditing ? (
        <textarea
          value={editData.description}
          onChange={(e) =>
            setEditData({
              ...editData,
              description: e.target.value,
            })
          }
        />
      ) : (
        <p className="event-description">{description}</p>
      )}

      <h2 className="event-attendees-title">
        Attendees {participantCount} / {maxAttendees}
      </h2>

      {/* ADMIN CONTROLS */}
      {isAdmin && !isEditing && (
        <button
          className="ui-button ui-button--secondary"
          onClick={() => setIsEditing(true)}
        >
          Edit Event
        </button>
      )}

      {isAdmin && isEditing && (
        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
          <button
            className="ui-button ui-button--primary"
            onClick={handleSaveEdit}
          >
            Save
          </button>
          <button
            className="ui-button ui-button--secondary"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default EventDetailPage;