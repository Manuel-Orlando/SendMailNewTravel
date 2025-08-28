import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function DetalhesViagem() {
  const { id } = useParams();
  const [viagem, setViagem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchViagem = async () => {
      try {
        setLoading(true);
        setError("");
        const resposta = await api.get(`/viagens/${id}`);
        setViagem(resposta.data);
      } catch (erro) {
        console.error("Erro ao buscar viagem:", erro);
        setError("Viagem não encontrada ou erro ao carregar");
      } finally {
        setLoading(false);
      }
    };

    fetchViagem();
  }, [id]);

  const calcularParcelas = (preco) => {
    if (!preco) return "12x de R$ 0,00";
    const valorParcela = (preco / 12).toFixed(2);
    return `12x de R$ ${valorParcela.replace(".", ",")}`;
  };

  if (loading)
    return <p className="p-4 text-center">⏳ Carregando detalhes...</p>;
  if (error) return <p className="p-4 text-center text-red-500">❌ {error}</p>;
  if (!viagem) return <p className="p-4 text-center">Viagem não encontrada</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{viagem.titulo}</h1>

      <img
        src={viagem.imagem}
        alt={viagem.titulo}
        className="w-full h-64 object-cover rounded-md mb-6"
      />

      {/* Descrição com tratamento para texto longo */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-3">Descrição</h2>
        <p
          className="text-gray-700 whitespace-pre-line break-words leading-relaxed"
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {viagem.descricao}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-semibold">Data:</p>
          <p>{viagem.dataFormatada || viagem.data}</p>
        </div>
        <div>
          <p className="font-semibold">Local de Embarque:</p>
          <p>{viagem.localEmbarque || viagem.boarding || "Não informado"}</p>
        </div>
        <div>
          <p className="font-semibold">Preço à vista:</p>
          <p className="text-green-600 font-bold">
            R${" "}
            {viagem.preco?.toFixed(2).replace(".", ",") ||
              viagem.price ||
              "Preço não informado"}
          </p>
        </div>
        <div>
          <p className="font-semibold">Parcelamento:</p>
          <p className="text-blue-600">
            {calcularParcelas(
              viagem.preco ||
                parseFloat(viagem.price?.replace("R$ ", "").replace(",", "."))
            )}
          </p>
        </div>
        <div>
          <p className="font-semibold">Vagas disponíveis:</p>
          <p>
            {viagem.vagasDisponiveis || viagem.vacancy}
            {viagem.vagasDisponiveis === 1 || viagem.vacancy === 1
              ? " vaga"
              : " vagas"}
          </p>
        </div>
        <div>
          <p className="font-semibold">Total de vagas:</p>
          <p>{viagem.vagasTotais || viagem.totalVacancies}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Guia turístico:</span>
          <span
            className={viagem.guiaTuristico ? "text-green-600" : "text-red-600"}
          >
            {viagem.guiaTuristico ? "✅ Incluso" : "❌ Não incluso"}
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">Café da manhã:</span>
          <span
            className={viagem.cafeDaManha ? "text-green-600" : "text-red-600"}
          >
            {viagem.cafeDaManha ? "✅ Incluso" : "❌ Não incluso"}
          </span>
        </div>
      </div>

      {/* Botão de reserva */}
      <div className="mt-6 text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
          Fazer Reserva
        </button>
      </div>
    </div>
  );
}
