import React from "react";
import calendarIcon from "../../assets/icons/calendar.svg";
import clockIcon from "../../assets/icons/clock.svg";


/* React component that displays the main header section of an event detail page,
 with support for editing the title and an attendance button. Core Purpose
Renders the visual header for an event page, including:Event image,Title (editable in edit mode)
Date and time information, Conditional attendance button*/ 

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

        <div className="event-detail-meta">
          <div className="event-detail-info">
            <img
              src={calendarIcon}
              alt="Date"
              className="event-detail-icon"
            />
            <span>{date}</span>
          </div>

          <div className="event-detail-info">
            <img
              src={clockIcon}
              alt="Time"
              className="event-detail-icon"
            />
            <span>
              {startTime} – {endTime}
            </span>
          </div>
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

