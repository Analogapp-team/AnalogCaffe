import React from "react";
import "./FormInput.css";

const FormInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  textarea = false,
  name,
}) => {
  return (
    <div className="form-input">
      {label && <label className="form-input-label">{label}</label>}
      {textarea ? (
        <textarea
          className="form-input-field form-textarea"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          rows="4"
        />
      ) : (
        <input
          type={type}
          className="form-input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
        />
      )}
    </div>
  );
};

export default FormInput;
