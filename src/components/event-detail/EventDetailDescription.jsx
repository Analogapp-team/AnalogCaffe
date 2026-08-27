import React from "react";

/* EventDetailDescription displays and allows editing of an event's description.
Manages the display vs. edit mode for an event's description section. 
It shows either a read-only paragraph or an editable textarea based on the editing state.
*/ 

function EventDetailDescription({
  isEditing,
  description,
  editDescription,
  onEditDescriptionChange,
}) {
  return (

    /* Uses React Fragment to wrap multiple elements without adding extra DOM nodes,
       Returns both the title and the conditional content as siblings
       <h2 className... Always visible in both view and edit modes*/ 
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
/* The component needs two separate values because 
description: The saved/original description (from database/API)
editDescription: The currently edited description (in-memory state)
This allows users to cancel edits without losing the original text*/ 
export default EventDetailDescription;
