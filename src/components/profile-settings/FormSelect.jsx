import React from "react";
import "./FormSelect.css";
import arrowIcon from "../../assets/icons/arrow.svg";

const FormSelect = ({ label, options = [], value, onChange }) => {
  return (
    <div className="form-select">
      {label && <label className="form-select__label">{label}</label>}
      <div className="form-select__field-wrapper">
        <select
          className="form-select__field"
          value={value}
          onChange={onChange}
        >
          <option value="">Make a selection</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <img
          src={arrowIcon}
          alt="Dropdown arrow"
          className="form-select__icon"
        />
      </div>
    </div>
  );
};

export default FormSelect;