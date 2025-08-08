import { RiArrowDownSLine } from "react-icons/ri";

export default function OrderSelect({ ordem, setOrdem }) {
  return (
    <div className="relative flex-1">
      <select
        value={ordem}
        onChange={(e) => setOrdem(e.target.value)}
        className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200 appearance-none"
        style={{ paddingRight: "2.5rem" }}
      >
        <option value="nenhum">Filtrar por...</option>
        <option value="maior">Maior preço</option>
        <option value="menor">Menor preço</option>
      </select>
      <span className="pointer-events-none absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
        <RiArrowDownSLine />
      </span>
    </div>
  );
}
