import React from "react";

const CircularComponent = ({
  number,
  size,
  color,
  bgcolor,
  children,
  onClick = () => {},
}) => {
  // Style object to define the circle's appearance
  const circleStyle = {
    width: `${size}px`,
    height: `${size}px`,
    padding: "2px",
    borderRadius: "50%",
    backgroundColor: bgcolor,
    color,
    border: `2px solid ${color}`,
    textAlign: "center",
    cursor: "pointer",
  };

  return (
    <div style={circleStyle} onClick={onClick}>
      {number}
      {children}
    </div>
  );
};

export default CircularComponent;
