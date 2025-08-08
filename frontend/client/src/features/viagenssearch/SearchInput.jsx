import { MdOutlineTravelExplore } from "react-icons/md";

export default function SearchInput({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative w-full sm:w-2/3">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar destino..."
        className="pl-12 px-5 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200 w-full"
      />
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
        <MdOutlineTravelExplore />
      </span>
    </div>
  );
}
