import { useState } from "react";
import { Viagens } from "../../data/ViagemData";
import ViagemCard from "./ViagemCard";
import VitrineSearch from "../viagenssearch/VitrineSearch";
import useInitialLoading from "../../hooks/useInitialLoading";
import useViagensFiltradas from "../../hooks/useViagensFiltradas";
import CardSkeleton from "../../components/ui/CardSkeleton";
import CardViagensPagination from "../../features/viagens/CardViagensPagination"; // Certifique-se de importar

export default function ViagensPage() {
  const loading = useInitialLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const [ordem, setOrdem] = useState("nenhum");
  const [showAll, setShowAll] = useState(false);

  const { viagensToShow, currentPage, setCurrentPage, totalPages } =
    useViagensFiltradas(Viagens, searchTerm, ordem, showAll);

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {/* 🔍 Campo de busca */}
      <VitrineSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        ordem={ordem}
        setOrdem={setOrdem}
        showAll={showAll}
        setShowAll={setShowAll}
      />

      {/* 🧱 Cards em grid alinhado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          : viagensToShow.map((viagem) => (
              <ViagemCard key={viagem.id} {...viagem} />
            ))}
      </div>

      {/* ⏮️ Paginação visível */}
      {!loading && !showAll && (
        <div className="mt-6">
          <CardViagensPagination
            currentPage={currentPage}
            totalPages={totalPages}
            maxPageButtons={5}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
