import React, { Children, useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.css"; // Import your CSS file for styling
function Header({ home, showAlert, children }) {
  const closeModal = () => setModal(!modal);

  const handleClick = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className={styles.navbar}>
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <div className={styles.logo}>QuizKosh</div>
      </Link>
      <div className={styles.links}>
        {children}
        {home ? (
          <div>
            <Link to="/auth" className={styles.link}>
              Login
            </Link>
          </div>
        ) : (
          <div>
            <button
              to="/auth"
              className={styles.link}
              style={{
                backgroundColor: "inherit",
                color: "white",
                padding: "0px",
              }}
              onClick={() => showAlert(true)}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
