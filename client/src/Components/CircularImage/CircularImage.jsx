import React from "react";
import styles from "./CircularImage.module.css";

function CircularImage({ size, imageUrl, altText }) {
  return (
    <div
      className={styles["circular-image"]}
      style={{ height: size, width: size }}
    >
      <img src={imageUrl} alt={altText} />
    </div>
  );
}

export default CircularImage;
