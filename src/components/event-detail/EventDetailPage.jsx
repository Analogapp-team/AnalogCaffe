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
import { isUserAdmin } from "../../utils/roles";

import EventDetailHeader from "./EventDetailHeader";
import EventDetailDescription from "./EventDetailDescription";
import EventAdminControls from "./EventAdminControls";

function EventDetailPage() {
  const { eventId } = useParams();
  const { currentUser } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);

  // LOAD EVENT
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

  // ADMIN CHECK (UI ONLY)
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

  if (loading) return <div>Loading event...</div>;
  if (!event) return <div>Event not found.</div>;

  // DERIVED DATA
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

  const isJoined = currentUser && participants.includes(currentUser.id);
  const isFull = maxAttendees > 0 && participantCount >= maxAttendees;

  const joinLeaveLabel = isJoined ? "Leave Event" : isFull ? "Full" : "Attend Event";
  const joinLeaveDisabled = isFull && !isJoined;

  // HANDLERS
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

  const handleCancelEdit = () => {
    setIsEditing(false);

    // Reset edit fields back to current event values (so cancel truly cancels)
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