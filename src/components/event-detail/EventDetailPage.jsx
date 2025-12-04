import React, { useEffect, useState } from "react";
import "../event-detail/EventDetailPage.css";
import { useParams, Link } from "react-router-dom";
import { getEventById, joinEvent, leaveEvent } from "../../configuration/EventService";
import { useAuth } from "../../configuration/AuthContext";
import Parse from "../../configuration/Back4App";

function EventDetailPage() {
  const { eventId } = useParams();
  const { currentUser } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading event...</div>;
  if (!event) return <div>Event not found.</div>;

  // Extract values
  const title = event.get("title");
  const description = event.get("description");
  const date = event.get("date");
  const startTime = event.get("startTime");
  const endTime = event.get("endTime");
  const maxAttendees = event.get("maxAttendees") || 0;
  const participants = event.get("participants") || [];

  const imageFile = event.get("image");
  const imageUrl = imageFile ? imageFile.url() : "/default-event.png";

  const createdBy = event.get("createdBy");
  const creatorName =
    createdBy?.get("firstName") || createdBy?.get("username") || "Unknown User";

  const isJoined = currentUser && participants.includes(currentUser.id);

  const handleJoinLeave = async () => {
    try {
      if (isJoined) {
        await leaveEvent(eventId);
      } else {
        await joinEvent(eventId);
      }

      // Refresh updated event
      const updated = await getEventById(eventId);
      setEvent(updated);
    } catch (err) {
      console.error("Join/Leave error:", err);
    }
  };

  return (
    <div className="event-detail-page">

      {/* Back link */}
      <Link to="/events" className="event-back-link">
        ← Back to all events
      </Link>

      <div className="event-detail-header">
        <img src={imageUrl} alt={title} className="event-detail-image" />

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

        <button className="event-attend-btn" onClick={handleJoinLeave}>
          {isJoined ? "Leave Event" : "Attend Event"}
        </button>
      </div>

      {/* ABOUT section */}
      <h2 className="event-section-title">About this event</h2>
      <p className="event-description">{description}</p>

      {/* ATTENDEE COUNT */}
      <h2 className="event-attendees-title">
        Attendees {participants.length}/{maxAttendees}
      </h2>

    </div>
  );
}

export default EventDetailPage;