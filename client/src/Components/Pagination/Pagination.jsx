import React from "react";
import "./Pagination.css";

function Pagination({ page, totalPages, goToPrePage, goToNextPage }) {
  if (totalPages === undefined || totalPages <= 1) return;
  return (
    <div className="pagination">
      <input
        type="button"
        value="PREV"
        onClick={goToPrePage}
        disabled={page === 1}
      />

      <p>
        {page} of {totalPages}{" "}
      </p>

      <input
        type="button"
        value="NEXT"
        onClick={goToNextPage}
        disabled={page === totalPages}
      />
    </div>
  );
}

export default Pagination;
