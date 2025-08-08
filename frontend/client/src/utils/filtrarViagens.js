function calcularPrecoTotal(precoString) {
  const match = precoString.match(/(\d+)x\s*R\$\s*(\d+),(\d{2})/);
  if (!match) return 0;
  const parcelas = parseInt(match[1]);
  const valorInteiro = parseInt(match[2]);
  const valorCentavos = parseInt(match[3]);
  const valorParcela = valorInteiro + valorCentavos / 100;
  return parcelas * valorParcela;
}

export function filtrarViagens(viagens, searchTerm, ordem) {
  let resultado = viagens.filter((viagem) =>
    viagem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (ordem === "maior") {
    resultado.sort(
      (a, b) => calcularPrecoTotal(b.price) - calcularPrecoTotal(a.price)
    );
  } else if (ordem === "menor") {
    resultado.sort(
      (a, b) => calcularPrecoTotal(a.price) - calcularPrecoTotal(b.price)
    );
  }

  return resultado;
}
