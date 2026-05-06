import React from "react";

function EventAdminControls({
  isAdmin,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
}) {
  if (!isAdmin) return null;

  if (!isEditing) {
    return (
      <button className="ui-button ui-button--secondary" onClick={onStartEdit}>
        Edit Event
      </button>
    );
  }

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