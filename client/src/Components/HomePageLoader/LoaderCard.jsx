import React from "react";

function LoaderCard() {
  return (
    <div className="card">
      <div className="card-head skeleton skeleton-text"></div>
      <div className="card-body">
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
      <div className="card-footer">
        <button className="skeleton skeleton-text"></button>
      </div>
    </div>
  );
}

export default LoaderCard;
