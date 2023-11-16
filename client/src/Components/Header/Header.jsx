import React, { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.css"; // Import your CSS file for styling
import Modal from "../Modal/Modal";
import axios from "axios";
import { useAuth } from "../../context/Auth/AuthState";

function Header() {
  const [modal, setModal] = useState(false);
  const closeModal = () => setModal(!modal);
  const { login, logout, isValidToken } = useAuth();
  const home = !isValidToken;
  const handleClick = (e) => {
    e.preventDefault();
    closeModal();
  };

  const logoutUser = () => {
    try {
      axios.post("");
    } catch (error) {}
  };
  return (
    <div className={styles.navbar}>
      <Modal closeModal={closeModal} modal={modal} />
      <div className={styles.logo}>Test Maniac</div>
      <div className={styles.links}>
        {!home && (
          <div>
            <Link className={styles.link} onClick={handleClick}>
              Create Test
            </Link>
          </div>
        )}
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
                cursor: "pointer",
              }}
              onClick={() => logout()}
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
