import React from "react";

export default function CardViagensPagination({
  currentPage,
  totalPages,
  maxPageButtons,
  setCurrentPage,
}) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-sky-500 text-white transition hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <div className="flex gap-2 items-center">
        {maxPageButtons <= 3 && (
          <span className="px-3 py-1 rounded-lg bg-sky-500 text-white font-bold">
            {currentPage}
          </span>
        )}
        {maxPageButtons > 3 && (
          <span className="ml-2 text-sky-700 font-semibold">
            Página {currentPage} de {totalPages}
          </span>
        )}
      </div>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-sky-500 text-white transition hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Próximo
      </button>
    </div>
  );
}
