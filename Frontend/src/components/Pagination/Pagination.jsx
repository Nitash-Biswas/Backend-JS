export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages } = pagination;
  // console.log("Pagination");
  return (
    <div className="flex justify-between items-center gap-4 mt-4 text-lighttext">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 bg-lightbg rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 bg-lightbg rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
