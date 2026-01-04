import React from "react";

function EventDetailDescription({
  isEditing,
  description,
  editDescription,
  onEditDescriptionChange,
}) {
  return (
    <>
      <h2 className="event-section-title">About this event</h2>

      {isEditing ? (
        <textarea value={editDescription} onChange={onEditDescriptionChange} />
      ) : (
        <p className="event-description">{description}</p>
      )}
    </>
  );
}

export default EventDetailDescription;