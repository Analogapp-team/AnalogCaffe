import React from "react";

function EventDetailHeader({
  imageUrl,
  title,
  date,
  startTime,
  endTime,
  isEditing,
  editTitle,
  onEditTitleChange,
  showAttendButton,
  onJoinLeave,
  joinLeaveLabel,
  joinLeaveDisabled,
}) {
  return (
    <div className="event-detail-header">
      <img src={imageUrl} alt={title} className="event-detail-image" />

      <div className="event-detail-header-info">
        {isEditing ? (
          <input value={editTitle} onChange={onEditTitleChange} />
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

      {showAttendButton && (
        <button
          className="ui-button ui-button--primary"
          onClick={onJoinLeave}
          disabled={joinLeaveDisabled}
        >
          {joinLeaveLabel}
        </button>
      )}
    </div>
  );
}

export default EventDetailHeader;