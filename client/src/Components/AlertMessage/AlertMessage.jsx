import React, { useEffect, useState } from "react";
import styles from "./AlertMessage.module.css";

function AlertMessage({ data, handleShowAlert }) {
  const [showAlert, setShowAlert] = useState(true);
  useEffect(() => {
    let timeout;

    if (showAlert) {
      timeout = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    if (!showAlert) {
      handleShowAlert(false);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [showAlert]);

  return (
    <div className={styles.alert}>
      <div style={{ backgroundColor: data.backgroundColor, color: data.color }}>
        {data.message}
      </div>
    </div>
  );
}

export default AlertMessage;
