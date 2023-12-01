import React, { useEffect, useRef, useState } from "react";
import "./Dropdown.css";

const Dropdown = ({
  options,
  onOptionSelect,
  children,
  style,
  onSearchTerm,
  selectedOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  console.log("dropwdown: ", selectedOptions);
  const handleOptionClick = (option) => {
    const selectedIndex = selectedOptions.indexOf(option);
    let newSelectedOptions = [];

    if (selectedIndex === -1) {
      newSelectedOptions = [...selectedOptions, option];
    } else {
      newSelectedOptions = selectedOptions.filter((item) => item !== option);
    }

    console.log(selectedIndex, newSelectedOptions);
    onOptionSelect(newSelectedOptions); // Pass selected options to parent component if needed
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    onSearchTerm(event.target.value);
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
          <input
            id="search"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <div className="dropdown-checkbox">
            {options.map((option) => (
              <div className="item" key={option}>
                <input
                  type="checkbox"
                  value={option.toLowerCase()}
                  checked={selectedOptions.includes(option.toLowerCase())}
                  onChange={() => handleOptionClick(option.toLowerCase())}
                />
                <label className="checkbox-label" htmlFor="">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
