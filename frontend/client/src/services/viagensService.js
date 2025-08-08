import axios from "axios";

export async function buscarViagens() {
  const res = await axios.get("/api/viagens");

  return res.data.map((viagem) => ({
    id: viagem._id,
    image: viagem.imagem,
    title: viagem.destino,
    text: viagem.descricao,
    data: viagem.data,
    vacancy: viagem.vagas,
    touristguide: viagem.touristguide,
    breakfast: viagem.breakfast,
    boarding: viagem.boarding,
    price: viagem.preco ? `R$ ${viagem.preco}` : "Preço não informado",
  }));
}
