import React from "react";
import styles from "./Loader.module.css"; // Import the CSS module

function Loader() {
  return <span className={styles.spinner}></span>;
}
export default Loader;
