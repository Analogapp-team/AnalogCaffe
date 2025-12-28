import React from "react";
import editIcon from "../../assets/icons/edit.svg";

const ChangeButton = ({ onClick }) => {
  return (
    <button
      className="ui-button ui-button--secondary ui-button--with-icon"
      onClick={onClick}
    >
      <img
        src={editIcon}
        alt="edit icon"
        className="ui-button__icon"
      />
      Change
    </button>
  );
};

export default ChangeButton;