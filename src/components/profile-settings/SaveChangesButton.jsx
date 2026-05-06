import React from "react";

const SaveChangesButton = ({ onClick }) => {
  return (
    <button
      className="ui-button ui-button--primary"
      onClick={onClick}
    >
      Save Changes
    </button>
  );
};

export default SaveChangesButton;