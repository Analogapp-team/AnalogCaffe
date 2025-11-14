import React from "react";
import "./ChangeButton.css";
import editIcon from "../../assets/icons/edit.svg";

const ChangeButton = ({ onClick }) => {
  return (
    <button className="change-btn" onClick={onClick}>
      <img src={editIcon} alt="edit icon" className="change-btn__icon" />
      <span className="change-btn__label">Change</span>
    </button>
  );
};

export default ChangeButton;
