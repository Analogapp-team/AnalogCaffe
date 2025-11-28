import React from "react";
import "./RemoveButton.css";
import deleteIcon from "../../assets/icons/delete.svg"; // your local icon

const RemoveButton = ({ onClick }) => {
  return (
    <button className="remove-btn" onClick={onClick}>
      <img src={deleteIcon} alt="delete icon" className="remove-btn__icon" />
      <span className="remove-btn__label">Remove</span>
    </button>
  );
};

export default RemoveButton;
