import React from "react";

const CircularComponent = ({ number, size, color, bgcolor }) => {
  // Style object to define the circle's appearance
  const circleStyle = {
    width: `${size}px`,
    height: `${size}px`,
    padding: "2px",
    borderRadius: "50%",
    backgroundColor: bgcolor,
    color,
    textAlign: "center",
  };

  return (
    <div className="circle" style={circleStyle}>
      {number}
    </div>
  );
};

export default CircularComponent;
