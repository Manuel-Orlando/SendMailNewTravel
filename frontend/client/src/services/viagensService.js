import axios from "axios";
export async function buscarViagens() {
  const res = await axios.get("/viagens"); // Use o proxy configurado

  return res.data.map((viagem) => ({
    id: viagem._id,
    image: viagem.imagem,
    title: viagem.titulo,
    text: viagem.descricao,
    data: viagem.dataFormatada, // Usa a data formatada
    vacancy: viagem.vagasDisponiveis,
    totalVacancies: viagem.vagasTotais,
    touristguide: viagem.guiaTuristico ? "Incluso" : "Não incluso",
    breakfast: viagem.cafeDaManha ? "Incluso" : "Não incluso",
    boarding: viagem.localEmbarque,
    price: viagem.preco
      ? `R$ ${viagem.preco.toFixed(2).replace(".", ",")}`
      : "Preço não informado",
    installments: `12x de R$ ${(viagem.preco / 12)
      .toFixed(2)
      .replace(".", ",")}`,
  }));
}
