import React from "react";
import styles from "./Input.module.css";

function Input({ handleChange, type, name, value, placeholder, error }) {
  return (
    <div className={styles.inputContainer}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      <p style={{ color: "red", fontSize: "0.8em" }}>{error}</p>
    </div>
  );
}

export default Input;
