import React from "react";

/*provides conditional admin-only editing controls for an event 
management interface. Displays different button sets based on: 
Whether the current user is an admin or Whether the event is currently being edited */ 

function EventAdminControls({
  isAdmin,  // Boolean: whether current user has admin privileges
  isEditing,  // Boolean: whether the event is in edit mode
  onStartEdit,  // Function: called when "Edit Event" is clicked
  onSave,   // Function: called when "Save" is clicked
  onCancel,  // Function: called when "Cancel" is clicked
}) {
  if (!isAdmin) return null;  // Component renders nothing (returns null)

  if (!isEditing) {
    // Clicking it triggers onStartEdit, switching to edit mode
    return (
      <button className="ui-button ui-button--secondary" onClick={onStartEdit}> 
        Edit Event
      </button>
    );
  }

  /* ui-button:Base button style, 
  ui-button--primary: Primary action (Save)
  ui-button--secondary: Secondary action (Edit, Cancel)
  Regular user sees no controls at all, Admin in view mode sees "Edit Event" button.
 */

  return (
    <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
      <button className="ui-button ui-button--primary" onClick={onSave}>
        Save
      </button>
      <button className="ui-button ui-button--secondary" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

export default EventAdminControls;
