import React, { useEffect, useRef, useState } from "react";
import "./Dropdown.css";

const Dropdown = ({ options, onOptionSelect, children, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    const selectedIndex = selectedOptions.indexOf(option);
    let newSelectedOptions = [];

    if (selectedIndex === -1) {
      newSelectedOptions = [...selectedOptions, option];
    } else {
      newSelectedOptions = selectedOptions.filter((item) => item !== option);
    }

    setSelectedOptions(newSelectedOptions);
    // onOptionSelect(newSelectedOptions); // Pass selected options to parent component if needed
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="dropdown" style={style} ref={dropdownRef}>
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        {children}
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div className="item">
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionClick(option)}
              />
              <label key={option} className="checkbox-label" htmlFor="">
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
