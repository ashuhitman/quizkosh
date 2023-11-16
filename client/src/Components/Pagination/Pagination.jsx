import React from "react";
import "./Pagination.css";

function Pagination({ page, totalPage, goToPrePage, goToNextPage }) {
  return (
    <div className="pagination">
      <input type="button" value="PREV" onClick={goToPrePage} />
      {!totalPage === 0 && (
        <p>
          {page} of {totalPage}{" "}
        </p>
      )}
      <input type="button" value="NEXT" onClick={goToNextPage} />
    </div>
  );
}

export default Pagination;
