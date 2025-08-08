import { useEffect } from "react";
import usePagination from "./usePagination";

export default function useViagensFiltradas(
  viagens,
  searchTerm,
  ordem,
  showAll,
  setCurrentPage
) {
  // 🔍 Filtragem
  const filtered = viagens.filter((viagem) =>
    viagem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📊 Ordenação
  const extractPrice = (priceStr) => {
    const match = priceStr.match(/R\$ (\d+[.,]?\d*)/);
    return match ? parseFloat(match[1].replace(",", ".")) : 0;
  };

  const ordered = [...filtered].sort((a, b) => {
    const priceA = extractPrice(a.price);
    const priceB = extractPrice(b.price);
    if (ordem === "maior") return priceB - priceA;
    if (ordem === "menor") return priceA - priceB;
    return 0;
  });

  // 🔁 Paginação
  const {
    currentPage,
    setCurrentPage: updatePage,
    totalPages,
    paginatedData,
  } = usePagination(ordered, 3); // 3 cards por página

  // 🔄 Resetar página ao aplicar filtros
  useEffect(() => {
    updatePage(1);
    if (setCurrentPage) setCurrentPage(1); // opcional, se quiser sincronizar fora
  }, [searchTerm, ordem, showAll]);

  const viagensToShow = showAll ? ordered : paginatedData;

  return {
    viagensToShow,
    currentPage,
    setCurrentPage: updatePage,
    totalPages,
  };
}
