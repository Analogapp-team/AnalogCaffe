import React from "react";
import deleteIcon from "../../assets/icons/delete.svg";

const RemoveButton = ({ onClick }) => {
  return (
    <button
      className="ui-button ui-button--danger ui-button--with-icon"
      onClick={onClick}
    >
      <img
        src={deleteIcon}
        alt="delete icon"
        className="ui-button__icon"
      />
      Remove
    </button>
  );
};

export default RemoveButton;