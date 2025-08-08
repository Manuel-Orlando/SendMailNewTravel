export default function ToggleViewButton({ showAll, setShowAll }) {
  return (
    <button
      onClick={() => setShowAll((prev) => !prev)}
      className="flex-1 px-4 py-3 rounded-lg bg-sky-500 text-white transition hover:bg-sky-600"
    >
      {showAll ? "Ver paginado" : "Ver tudo"}
    </button>
  );
}
