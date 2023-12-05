import React, { Children, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AiFillSetting } from "react-icons/ai";

import styles from "./Header.module.css"; // Import your CSS file for styling
import DropdownList from "../DropdownList/DropdownList";
import { useAuth } from "../../context/Auth/AuthState";
import Alert from "../Alert/Alert";
function Header({ children }) {
  const [showAlert, setShowAlert] = useState(false);
  const { login, logout, token, user } = useAuth();

  return (
    <>
      <Alert
        show={showAlert}
        showHandler={setShowAlert}
        title="Logout"
        body="Are you sure?"
        leftText="Yes"
        handleLeft={logout}
        rightText="No"
      />
      <div className={styles.navbar}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <div className={styles.logo}>QuizKosh</div>
        </Link>
        <div className={styles.links}>
          <div style={{ marginRight: "10px" }}>{children}</div>
          {!user ? (
            <div>
              <Link to="/auth" className={styles.link}>
                Login
              </Link>
            </div>
          ) : (
            <div>
              <DropdownList setShowAlert={setShowAlert}>
                <AiFillSetting />
              </DropdownList>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
