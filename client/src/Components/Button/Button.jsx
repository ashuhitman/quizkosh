import React from "react";
import "./Button.css";

function Button({
  type = "text",
  text,
  color,
  bgColor,
  ph,
  py,
  radius,
  bw,
  bs,
  borderColor,
  boxShadow,
  fontSize,
  clickFun = () => {},
  disabled,
  children,
}) {
  const btnStyle = {
    fontSize: fontSize,
    cursor: "pointer",
    color: color || "black",
    backgroundColor: bgColor || "white",
    paddingLeft: ph,
    paddingRight: ph,
    paddingTop: py,
    paddingBottom: py,
    borderRadius: radius || "2px",
    boderWidth: bw || "1px",
    borderStyle: bs || "solid",
    borderColor: borderColor || "white",
    boxShadow: boxShadow || "",
  };
  return (
    <button
      type={type}
      style={btnStyle}
      className={disabled ? "disabled-button" : ""}
      onClick={!disabled ? clickFun : undefined}
    >
      {children}
      {text}
    </button>
  );
}

export default Button;
