import React, { useState } from "react";
import styles from "./Auth.module.css";
import Input from "../../Components/Input/Input";
import Login from "./Login";
import Signup from "./Signup";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const changeAuthState = (x) => {
    x == 0 ? setIsLogin(true) : setIsLogin(false);
  };
  return (
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
        <div className={styles.auth}>{isLogin ? <Login /> : <Signup />}</div>
      </div>
    </div>
  );
}

export default Auth;
