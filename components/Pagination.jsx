function Pagination({ page, pageSize, totalItems, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize);
  return (
    <section className="container flex items-center justify-center mx-auto my-8">
      <button
        className="px-2 py-1 mr-2 text-white bg-blue-500 border border-gray-300 rounded disabled:cursor-not-allowed disabled:opacity-50"
        disabled={page === 1 ? true : false}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="mx-2">
        Page {page} of {totalPages}
      </span>
      <button
        className="px-2 py-1 ml-2 text-white bg-blue-500 border border-gray-300 rounded disabled:cursor-not-allowed disabled:opacity-50"
        disabled={page === totalPages ? true : false}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </section>
  );
}

export default Pagination;
