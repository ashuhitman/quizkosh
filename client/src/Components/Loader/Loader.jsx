import React from "react";
import styles from "./Loader.module.css"; // Import the CSS module

function Loader({ size, borderWidth, borderColor }) {
  return (
    <span
      className={styles.spinner}
      style={{ height: size, width: size, borderWidth, borderColor }}
    ></span>
  );
}
export default Loader;
