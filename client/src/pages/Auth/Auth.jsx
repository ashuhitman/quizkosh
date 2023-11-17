import React, { useState } from "react";
import styles from "./Auth.module.css";
import Input from "../../Components/Input/Input";
import Login from "./Login";
import Signup from "./Signup";
import AlertMessage from "../../Components/AlertMessage/AlertMessage";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [alertData, setAlertData] = useState({
    show: false,
    message: "",
    color: "#965562",
    backgroundColor: "#f2dedf",
  });

  const handleShowAlert = (
    show,
    message,
    color = "#965562",
    backgroundColor = "#f2dedf"
  ) => {
    setAlertData({ ...alertData, show, backgroundColor, color, message });
  };
  const changeAuthState = (x) => {
    x == 0 ? setIsLogin(true) : setIsLogin(false);
  };
  return (
    <>
      {alertData.show && (
        <AlertMessage data={alertData} handleShowAlert={handleShowAlert} />
      )}
      <div className={styles.authContainer}>
        <div className={styles.box}>
          <div style={{ textAlign: "center" }}>
            <h2>{isLogin ? "Login Form" : "Signup Form"}</h2>
          </div>
          <div className={styles.authButtons}>
            <button
              className={!isLogin ? styles["not-active"] : ""}
              onClick={() => changeAuthState(0)}
            >
              Login
            </button>
            <button
              className={isLogin ? styles["not-active"] : ""}
              onClick={() => changeAuthState(1)}
            >
              Signup
            </button>
          </div>
          <div className={styles.auth}>
            {isLogin ? (
              <Login handleShowAlert={handleShowAlert} />
            ) : (
              <Signup
                changeAuthState={changeAuthState}
                handleShowAlert={handleShowAlert}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
