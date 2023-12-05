import React from "react";
import styles from "./Loader.module.css"; // Import the CSS module

function Loader({ size, borderWidth, borderColor, style }) {
  return (
    <div style={style}>
      <span
        className={styles.spinner}
        style={{ height: size, width: size, borderWidth, borderColor }}
      ></span>
    </div>
  );
}
export default Loader;
