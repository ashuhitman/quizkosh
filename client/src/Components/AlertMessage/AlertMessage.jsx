import React, { useEffect, useState } from "react";
import styles from "./AlertMessage.module.css";

function AlertMessage({ data, handleShowAlert }) {
  useEffect(() => {
    let timeout;

    if (data.show) {
      timeout = setTimeout(() => {
        handleShowAlert(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!data.show) {
    return <></>;
  }
  return (
    <div className={styles.alert}>
      <div style={{ backgroundColor: data.backgroundColor, color: data.color }}>
        {data.message}
      </div>
    </div>
  );
}

export default AlertMessage;
