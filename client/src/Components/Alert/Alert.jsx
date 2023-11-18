import React, { useState } from "react";
import styles from "./Alert.module.css";
import Loader from "../Loader/Loader";

function Alert({
  show = false,
  showHandler,
  title = "Alert Info",
  body,
  handleLeft = null,
  leftText,
  rightText = "OK",
  bgColor = "#2c3e50",
  color = "white",
}) {
  const [showLoader, setShowLoader] = useState(false);
  if (!show) return <></>;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.alert}
        style={{ backgroundColor: bgColor, color: color }}
      >
        <div className={styles.alertHead}>
          <p>{title}</p>
          {showLoader && <Loader size="10px" />}
        </div>
        <div className={styles.alertBody}>{body}</div>
        <div className={styles.alertFooter}>
          {handleLeft && (
            <button
              onClick={async () => {
                setShowLoader(true);
                if (await handleLeft()) {
                  console.log("hide old");
                  showHandler(false);
                }
              }}
            >
              {leftText}
            </button>
          )}
          <button onClick={() => showHandler(false)}>{rightText}</button>
        </div>
      </div>
    </div>
  );
}

export default Alert;
