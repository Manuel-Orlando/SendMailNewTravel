import SearchInput from "./SearchInput";
import OrderSelect from "./OrderSelect";
import ToggleViewButton from "./ToggleViewButton";

export default function VitrineSearch({
  searchTerm,
  setSearchTerm,
  ordem,
  setOrdem,
  showAll,
  setShowAll,
}) {
  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex flex-col items-start mb-4">
        <span className="text-6xl font-bold text-sky-700">
          Colecione novos momentos.
        </span>
        <span className="text-3xl text-gray-700">
          Descubra destinos que vão marcar a sua história!
        </span>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex w-full sm:w-1/3 gap-4">
          <OrderSelect ordem={ordem} setOrdem={setOrdem} />
          <ToggleViewButton showAll={showAll} setShowAll={setShowAll} />
        </div>
      </div>
    </div>
  );
}
