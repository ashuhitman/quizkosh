import React, { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.css"; // Import your CSS file for styling
import Modal from "../Modal/Modal";
import axios from "axios";
import { MdAddCircle } from "react-icons/md";

function Header({ home, showAlert }) {
  const [modal, setModal] = useState(false);

  const closeModal = () => setModal(!modal);

  const handleClick = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className={styles.navbar}>
      <Modal closeModal={closeModal} modal={modal} />
      <div className={styles.logo}>QuizKosh</div>
      <div className={styles.links}>
        {!home && (
          <div>
            <Link className={styles.link} onClick={handleClick}>
              <MdAddCircle size="25" />
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
