import React from "react";
import "./OptionField.css";

function OptionField({ options, value, onChange, error }) {
  return (
    <>
      <select
        value={value}
        onChange={onChange}
        name="timer"
        className={error ? "error" : ""}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}

export default OptionField;
