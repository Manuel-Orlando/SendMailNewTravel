import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";

const REQUEST_TIMEOUT = 30000;

// Função para formatar a data no formato "25 - 29 de Ago"
const formatarData = (dataString) => {
  if (!dataString) return "";

  const partes = dataString.split("-");
  if (partes.length !== 3) return dataString;

  const [ano, mes, dia] = partes;
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return `${dia} de ${meses[parseInt(mes) - 1]}`;
};

// Função para calcular parcelas (12x)
const calcularParcelas = (preco) => {
  if (!preco) return "12x de R$ 0,00";
  const valorParcela = (preco / 12).toFixed(2);
  return `12x de R$ ${valorParcela.replace(".", ",")}`;
};

export default function AdminPanel() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [viagens, setViagens] = useState([]);
  const [novaViagem, setNovaViagem] = useState({
    titulo: "",
    descricao: "",
    imagem: "",
    preco: "",
    precoOriginal: 0,
    vagasDisponiveis: 0,
    vagasTotais: 0,
    data: "",
    dataFormatada: "",
    localEmbarque: "",
    guiaTuristico: false,
    cafeDaManha: false,
  });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contadorDescricao, setContadorDescricao] = useState(0);

  useEffect(() => {
    if (!isAdmin) navigate("/");
    carregarViagens();
  }, [isAdmin, navigate]);

  const carregarViagens = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/viagens", {
        timeout: REQUEST_TIMEOUT,
      });

      setViagens(res.data.viagens || res.data);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        setError("A requisição demorou muito. Verifique sua conexão.");
      } else if (error.response?.status === 401) {
        setError("Não autorizado. Faça login novamente.");
        logout();
      } else {
        setError(
          "Erro ao carregar viagens: " + (error.message || "Erro desconhecido")
        );
      }
      console.error("Erro ao carregar viagens:", error);
    } finally {
      setLoading(false);
    }
  };

  const criarViagem = async () => {
    if (
      !novaViagem.titulo ||
      !novaViagem.descricao ||
      !novaViagem.data ||
      !novaViagem.preco ||
      novaViagem.vagasDisponiveis <= 0 ||
      !novaViagem.localEmbarque
    ) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (novaViagem.descricao.length > 500) {
      setError("A descrição não pode ter mais de 500 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Formata a data
      const dataFormatada = formatarData(novaViagem.data);

      // Converte preço para número
      const precoNumerico = parseFloat(
        novaViagem.preco.replace("R$ ", "").replace(",", ".").trim()
      );

      const response = await api.post(
        "/viagens",
        {
          titulo: novaViagem.titulo,
          descricao: novaViagem.descricao,
          imagem: novaViagem.imagem || "https://via.placeholder.com/300x200",
          preco: precoNumerico,
          precoOriginal: precoNumerico,
          vagasDisponiveis: Number(novaViagem.vagasDisponiveis),
          vagasTotais: Number(novaViagem.vagasDisponiveis),
          data: novaViagem.data,
          dataFormatada: dataFormatada,
          localEmbarque: novaViagem.localEmbarque,
          guiaTuristico: novaViagem.guiaTuristico,
          cafeDaManha: novaViagem.cafeDaManha,
        },
        {
          timeout: 15000,
        }
      );

      // Reset do formulário
      setNovaViagem({
        titulo: "",
        descricao: "",
        imagem: "",
        preco: "",
        precoOriginal: 0,
        vagasDisponiveis: 0,
        vagasTotais: 0,
        data: "",
        dataFormatada: "",
        localEmbarque: "",
        guiaTuristico: false,
        cafeDaManha: false,
      });

      setContadorDescricao(0);

      // Recarrega a lista de viagens
      await carregarViagens();
    } catch (error) {
      // Ignora erros de cancelamento
      if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
        console.log("Criação cancelada");
        return;
      }

      let errorMessage = "Erro ao criar viagem";
      if (error.response) {
        errorMessage =
          error.response.data?.erro ||
          error.response.data?.message ||
          "Erro no servidor";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Timeout: O servidor demorou muito para responder";
      } else if (error.request) {
        errorMessage =
          "Sem resposta do servidor. Verifique se o backend está rodando.";
      }

      setError(errorMessage);
      console.error("Erro ao criar viagem:", error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarViagem = async () => {
    if (!editando) return;

    setLoading(true);
    setError("");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await api.put(`/viagens/${editando._id}`, editando, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("Viagem atualizada:", response.data);

      setEditando(null);
      await carregarViagens();
    } catch (error) {
      clearTimeout(timeoutId);

      let errorMessage = "Erro ao atualizar viagem";
      if (error.name === "AbortError") {
        errorMessage = "A requisição demorou muito. Tente novamente.";
      } else if (error.response) {
        errorMessage =
          error.response.data?.erro ||
          error.response.data?.message ||
          "Erro no servidor";
      }

      setError(errorMessage);
      console.error("Erro ao atualizar viagem:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletarViagem = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta viagem?")) return;

    setLoading(true);
    setError("");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      await api.delete(`/viagens/${id}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      await carregarViagens();
    } catch (error) {
      clearTimeout(timeoutId);

      let errorMessage = "Erro ao excluir viagem";
      if (error.name === "AbortError") {
        errorMessage = "A requisição demorou muito. Tente novamente.";
      } else if (error.response) {
        errorMessage =
          error.response.data?.erro ||
          error.response.data?.message ||
          "Erro no servidor";
      }

      setError(errorMessage);
      console.error("Erro ao excluir viagem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value, type, checked } = e.target;
    let updatedValue;

    if (type === "checkbox") {
      updatedValue = checked;
    } else if (name.includes("vagas")) {
      updatedValue = parseInt(value) || 0;
    } else if (name === "preco") {
      // Formata o preço para incluir "R$ " automaticamente
      updatedValue = value.startsWith("R$ ") ? value : `R$ ${value}`;
    } else if (name === "descricao") {
      updatedValue = value;
      if (!isEditing) {
        setContadorDescricao(value.length);
      }
    } else {
      updatedValue = value;
    }

    if (isEditing) {
      setEditando((prev) => ({
        ...prev,
        [name]: updatedValue,
        ...(name === "vagasDisponiveis" && { vagasTotais: updatedValue }),
      }));
    } else {
      setNovaViagem((prev) => ({
        ...prev,
        [name]: updatedValue,
      }));
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Criar Nova Viagem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="titulo"
            placeholder="Título*"
            className="p-2 border rounded"
            value={novaViagem.titulo}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="imagem"
            placeholder="URL da Imagem"
            className="p-2 border rounded"
            value={novaViagem.imagem}
            onChange={handleInputChange}
          />
          <div className="md:col-span-2">
            <textarea
              name="descricao"
              placeholder="Descrição* (máximo 500 caracteres)"
              className="p-2 border rounded w-full"
              rows="3"
              value={novaViagem.descricao}
              onChange={handleInputChange}
              maxLength={500}
            />
            <div className="text-sm text-gray-500 text-right">
              {contadorDescricao}/500 caracteres
            </div>
          </div>
          <input
            type="text"
            name="preco"
            placeholder="Preço* (ex: 100,00)"
            className="p-2 border rounded"
            value={novaViagem.preco}
            onChange={handleInputChange}
          />
          <div className="p-2 bg-gray-100 rounded">
            <span className="text-sm font-medium">Parcelamento: </span>
            <span className="text-sm">
              {calcularParcelas(
                parseFloat(
                  novaViagem.preco.replace("R$ ", "").replace(",", ".")
                ) || 0
              )}
            </span>
          </div>
          <input
            type="number"
            name="vagasDisponiveis"
            placeholder="Vagas Disponíveis*"
            className="p-2 border rounded"
            value={novaViagem.vagasDisponiveis}
            onChange={handleInputChange}
            min="0"
          />
          <input
            type="date"
            name="data"
            className="p-2 border rounded"
            value={novaViagem.data}
            onChange={handleInputChange}
            required
          />
          <div className="p-2 bg-gray-100 rounded">
            <span className="text-sm font-medium">Data formatada: </span>
            <span className="text-sm">{formatarData(novaViagem.data)}</span>
          </div>
          <input
            type="text"
            name="localEmbarque"
            placeholder="Local de Embarque* (ex: Recife - PE)"
            className="p-2 border rounded md:col-span-2"
            value={novaViagem.localEmbarque}
            onChange={handleInputChange}
          />
          <div className="flex items-center space-x-4 md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="guiaTuristico"
                checked={novaViagem.guiaTuristico}
                onChange={handleInputChange}
                className="mr-2"
              />
              Guia Turístico Incluso
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="cafeDaManha"
                checked={novaViagem.cafeDaManha}
                onChange={handleInputChange}
                className="mr-2"
              />
              Café da Manhã Incluso
            </label>
          </div>
        </div>
        <button
          onClick={criarViagem}
          disabled={loading}
          className={`mt-4 px-4 py-2 rounded flex items-center gap-2 ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? (
            "Enviando..."
          ) : (
            <>
              <FiPlus /> Criar Viagem
            </>
          )}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Viagens Cadastradas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Título</th>
                <th className="py-2 px-4 border-b">Preço</th>
                <th className="py-2 px-4 border-b">Parcelas</th>
                <th className="py-2 px-4 border-b">Vagas</th>
                <th className="py-2 px-4 border-b">Data</th>
                <th className="py-2 px-4 border-b">Embarque</th>
                <th className="py-2 px-4 border-b">Guia</th>
                <th className="py-2 px-4 border-b">Café</th>
                <th className="py-2 px-4 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {viagens.map((viagem) => (
                <tr key={viagem._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{viagem.titulo}</td>
                  <td className="py-2 px-4 border-b">
                    R$ {viagem.preco?.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {calcularParcelas(viagem.preco)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {viagem.vagasDisponiveis}{" "}
                    {viagem.vagasDisponiveis === 1 ? "Vaga" : "Vagas"} /{" "}
                    {viagem.vagasTotais}
                  </td>
                  <td className="py-2 px-4 border-b">{viagem.dataFormatada}</td>
                  <td className="py-2 px-4 border-b">{viagem.localEmbarque}</td>
                  <td className="py-2 px-4 border-b">
                    {viagem.guiaTuristico ? "Incluso" : "Não incluso"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {viagem.cafeDaManha ? "Incluso" : "Não incluso"}
                  </td>
                  <td className="py-2 px-4 border-b flex gap-2">
                    {editando?._id === viagem._id ? (
                      <>
                        <button
                          onClick={atualizarViagem}
                          disabled={loading}
                          className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                          title="Salvar"
                        >
                          <FiSave />
                        </button>
                        <button
                          onClick={() => setEditando(null)}
                          className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                          title="Cancelar"
                          disabled={loading}
                        >
                          <FiX />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditando(viagem)}
                          className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                          title="Editar"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => deletarViagem(viagem._id)}
                          disabled={loading}
                          className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                          title="Excluir"
                        >
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
