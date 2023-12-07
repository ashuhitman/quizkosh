import React, { useState } from "react";

const CircularComponent = ({
  number,
  size,
  color,
  bgcolor,
  children,
  marginLeft,
  hoverStyle,
  onClick = () => {},
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const getHoverStyle = () => {
    return isHovered ? hoverStyle : "";
  };
  const circleStyle = {
    width: `${size}px`,
    height: `${size}px`,
    padding: "2px",
    borderRadius: "50%",
    backgroundColor: bgcolor,
    color,
    border: `2px solid ${color}`,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft,
    ...getHoverStyle(),
  };

  return (
    <div
      style={circleStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {number}
      {children}
    </div>
  );
};

export default CircularComponent;
