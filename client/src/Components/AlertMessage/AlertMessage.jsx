import React, { useEffect, useState } from "react";
import styles from "./AlertMessage.module.css";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";
import CircularComponent from "../CircularComponent/CircularComponent.jsx";
function AlertMessage({ data, handleShowAlert }) {
  useEffect(() => {
    let timeout;

    if (data.show) {
      timeout = setTimeout(() => {
        handleShowAlert({ show: false });
      }, 4000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [data.show]);

  if (!data.show) {
    return <></>;
  }
  return (
    <div className={styles["alert-container"]}>
      <div
        className={
          data.success
            ? `${styles.alert} ${styles.success}`
            : `${styles.alert} ${styles.failure}`
        }
      >
        <div className={styles["alert-type"]}>
          <CircularComponent color={data.success ? "green" : "red"} size="20">
            {data.success ? <FaCheck /> : <BiSolidError />}
          </CircularComponent>
        </div>
        <div className={styles["alert-message"]}>{data.message}</div>
        <div
          className={styles["cancel-alert"]}
          onClick={() => handleShowAlert({ show: false })}
        >
          <ImCross color="white" />{" "}
        </div>
      </div>
    </div>
  );
}

export default AlertMessage;
