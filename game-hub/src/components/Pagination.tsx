type Props = {
  page: number;
  totalPages: number;
  pages: number[];
  previous: string;
  next: string;
  setPage: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  pages,
  previous,
  next,
  setPage
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => setPage(Math.max(1, page - 1))}
        aria-label={previous}
      >
        ←
      </button>

      {pages.map((number) => (
        <button
          type="button"
          key={number}
          className={page === number ? "active" : ""}
          onClick={() => setPage(number)}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        aria-label={next}
      >
        →
      </button>
    </div>
  );
}