import axios from "axios";
export async function buscarViagens() {
  const res = await axios.get("/viagens"); // Use o proxy configurado

  return res.data.map((viagem) => ({
    id: viagem._id,
    image: viagem.imagem,
    title: viagem.titulo,
    text: viagem.descricao,
    data: viagem.data,
    vacancy: viagem.vagasDisponiveis || viagem.vagas, // Use o campo correto
    touristguide: viagem.guiaTuristico,
    breakfast: viagem.cafeDaManha,
    boarding: viagem.localEmbarque,
    price: viagem.preco ? `R$ ${viagem.preco}` : "Preço não informado",
  }));
}
