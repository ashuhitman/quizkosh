import React, { useEffect, useRef, useState } from "react";
import { IoMdLogOut } from "react-icons/io";

import "./DropdownList.css";
import { useNavigate } from "react-router-dom";
function DropdownList({ children, setShowAlert }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="dropdown-list" ref={dropdownRef}>
      <div className="dropdown-btn" onClick={toggleDropdown}>
        {children}
      </div>
      {isOpen && (
        <ul className="dropdown-list-menu">
          <li onClick={() => navigate("/user/profile")}>Profile</li>
          <li onClick={() => setShowAlert(true)}>Log Out</li>
        </ul>
      )}
    </div>
  );
}

export default DropdownList;
