import React, { useEffect, useState } from "react";
import "./EventDetailPage.css";
import { useParams, Link } from "react-router-dom";
import {
  getEventById,
  joinEvent,
  leaveEvent,
  updateEvent,
} from "../../configuration/EventService";
import { useAuth } from "../../configuration/AuthContext";
import { isUserAdmin } from "../../utils/Roles";

import EventDetailHeader from "./EventDetailHeader";
import EventDetailDescription from "./EventDetailDescription";
import EventAdminControls from "./EventAdminControls";

function EventDetailPage() {
  // Read eventId from the URL (/events/:eventId)
  const { eventId } = useParams();

  // Get currently logged-in user from global auth context
  const { currentUser } = useAuth();

  // Holds the event object fetched from the backend
  const [event, setEvent] = useState(null);

  // Controls loading state while fetching event
  const [loading, setLoading] = useState(true);

  // Toggles admin edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Temporary state for editable fields
  const [editData, setEditData] = useState({
    title: "",
    description: "",
  });

  // UI-only admin flag
  const [isAdmin, setIsAdmin] = useState(false);

  // Load event data when page mounts or eventId changes
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const result = await getEventById(eventId);
        setEvent(result);

        // Initialize edit fields with current event values
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

  // Check if the current user is an admin (UI-only)
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

  // Render loading state
  if (loading) return <div>Loading event...</div>;

  // Render error state
  if (!event) return <div>Event not found.</div>;

  // Extract event fields for cleaner JSX
  const title = event.get("title") || "Untitled event";
  const description = event.get("description") || "";
  const date = event.get("date") || "Date TBA";
  const startTime = event.get("startTime") || "";
  const endTime = event.get("endTime") || "";
  const maxAttendees = event.get("maxAttendees") || 0;

  // Participants are stored as an array of userId strings
  const participants = event.get("participants") || [];
  const participantCount = participants.length;

  // Resolve event image URL
  const imageFile = event.get("image");
  const imageUrl = imageFile ? imageFile.url() : "/default-event.png";

  // Determine if the current user joined the event
  const isJoined = currentUser && participants.includes(currentUser.id);

  // Determine if event is full
  const isFull = maxAttendees > 0 && participantCount >= maxAttendees;

  // Compute button label and disabled state
  const joinLeaveLabel = isJoined
    ? "Leave Event"
    : isFull
    ? "Full"
    : "Attend Event";

  const joinLeaveDisabled = isFull && !isJoined;

  // Handle attend / leave button click
  const handleJoinLeave = async () => {
    try {
      if (isJoined) {
        await leaveEvent(eventId);
      } else {
        await joinEvent(eventId);
      }

      // Re-fetch event to keep UI in sync with backend
      const updated = await getEventById(eventId);
      setEvent(updated);
    } catch (err) {
      console.error("Join/Leave error:", err);
    }
  };

  // Save admin edits to backend
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

  // Cancel editing and restore original values
  const handleCancelEdit = () => {
    setIsEditing(false);

    setEditData({
      title: event.get("title") || "",
      description: event.get("description") || "",
    });
  };

  return (
    <div className="event-detail-page">
      <Link to="/events" className="event-back-link">
        ← Back to all events
      </Link>

      <EventDetailHeader
        imageUrl={imageUrl}
        title={title}
        date={date}
        startTime={startTime}
        endTime={endTime}
        isEditing={isEditing}
        editTitle={editData.title}
        onEditTitleChange={(e) =>
          setEditData((prev) => ({ ...prev, title: e.target.value }))
        }
        showAttendButton={currentUser && !isEditing}
        onJoinLeave={handleJoinLeave}
        joinLeaveLabel={joinLeaveLabel}
        joinLeaveDisabled={joinLeaveDisabled}
      />

      <EventDetailDescription
        isEditing={isEditing}
        description={description}
        editDescription={editData.description}
        onEditDescriptionChange={(e) =>
          setEditData((prev) => ({ ...prev, description: e.target.value }))
        }
      />

      <h2 className="event-attendees-title">
        Attendees {participantCount} / {maxAttendees}
      </h2>

      <EventAdminControls
        isAdmin={isAdmin}
        isEditing={isEditing}
        onStartEdit={() => setIsEditing(true)}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}

export default EventDetailPage;
