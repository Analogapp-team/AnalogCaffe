import React from "react";
import "./EmailDisplay.css";
import emailIcon from "../../assets/icons/email.svg";

const EmailDisplay = ({ email }) => {
  return (
    <div className="email-display">
      <label className="email-display__label">Email address</label>
      <div className="email-display__field">
        <img src={emailIcon} alt="Email icon" className="email-display__icon" />
        <span className="email-display__text">{email}</span>
      </div>
    </div>
  );
};

export default EmailDisplay;