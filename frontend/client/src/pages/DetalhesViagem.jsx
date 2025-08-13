import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";

export default function DetalhesViagem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viagem, setViagem] = useState(null);

  useEffect(() => {
    // Simulação de fetch — substitua pela sua API real
    const fetchViagem = async () => {
      try {
        const resposta = await fetch(`https://api.seusite.com/viagens/${id}`);
        const dados = await resposta.json();
        setViagem(dados);
      } catch (erro) {
        console.error("Erro ao buscar viagem:", erro);
      }
    };

    fetchViagem();
  }, [id]);

  if (!viagem) {
    return (
      <p className="text-center mt-10 text-gray-600">Carregando viagem...</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
      >
        <FiArrowLeft /> Voltar
      </button>

      <img
        src={viagem.imagem}
        alt={viagem.destino}
        className="w-full h-64 object-cover rounded shadow-md mb-6"
      />

      <h2 className="text-2xl font-bold mb-2">{viagem.destino}</h2>
      <p className="text-gray-700 mb-4">{viagem.descricao}</p>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-2">
          <FiCalendar /> {viagem.dataInicio} até {viagem.dataFim}
        </div>
        <div className="flex items-center gap-2">
          <FiMapPin /> Partida: {viagem.partida}
        </div>
        <div className="flex items-center gap-2">
          <FiUser /> Vagas: {viagem.vagas}
        </div>
        <div className="flex items-center gap-2">
          <FiDollarSign /> Preço: 12x R$ {viagem.preco?.toFixed(2)}
        </div>
      </div>

      <div className="mb-6">
        {viagem.guia && <p>✅ Guia turístico incluso</p>}
        {viagem.cafe && <p>✅ Café da manhã incluso</p>}
      </div>

      <button
        onClick={() => navigate("/reservar/" + viagem.id)}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Reservar agora
      </button>
    </div>
  );
}
