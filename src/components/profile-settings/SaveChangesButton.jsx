import React from "react";
import "./SaveChangesButton.css";

const SaveChangesButton = ({ onClick }) => {
  return (
    <button className="save-btn" onClick={onClick}>
      Save Changes
    </button>
  );
};

export default SaveChangesButton;
