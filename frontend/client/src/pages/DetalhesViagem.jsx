import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function DetalhesViagem() {
  const { id } = useParams();
  const [viagem, setViagem] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchViagem = async () => {
      try {
        const resposta = await axios.get(`${API_URL}/viagens/${id}`);
        setViagem(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar viagem:", erro);
      }
    };

    fetchViagem();
  }, [id, API_URL]);

  if (!viagem) return <p>⏳ Carregando detalhes...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{viagem.titulo}</h1>
      <img
        src={viagem.imagem}
        alt={viagem.titulo}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <p className="mb-4">{viagem.descricao}</p>
      <p>
        <strong>Data:</strong> {viagem.data}
      </p>
      <p>
        <strong>Vagas disponíveis:</strong> {viagem.vagasDisponiveis}
      </p>
      <p>
        <strong>Guia turístico:</strong> {viagem.guiaTuristico}
      </p>
      <p>
        <strong>Café da manhã:</strong> {viagem.cafeDaManha}
      </p>
      <p>
        <strong>Embarque:</strong> {viagem.localEmbarque}
      </p>
      <p>
        <strong>Preço:</strong> {viagem.preco}
      </p>
    </div>
  );
}
