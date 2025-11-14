import React from "react";
import "./FormInput.css";

const FormInput = ({ label, type = "text", placeholder, value, onChange, textarea = false }) => {
  return (
    <div className="form-input">
      {label && <label className="form-input-label">{label}</label>}
      {textarea ? (
        <textarea
          className="form-input-field form-textarea"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows="4"
        />
      ) : (
        <input
          type={type}
          className="form-input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default FormInput;