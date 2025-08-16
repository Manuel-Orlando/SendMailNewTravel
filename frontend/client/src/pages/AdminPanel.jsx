import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [viagens, setViagens] = useState([]);
  const [novaViagem, setNovaViagem] = useState({
    titulo: "",
    descricao: "",
    imagem: "",
    preco: "",
    vagas: 0,
    data: "",
  });
  const [editando, setEditando] = useState(null);

  // Verifica se é admin, senão redireciona
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  // Carrega as viagens
  useEffect(() => {
    carregarViagens();
  }, []);

  const carregarViagens = async () => {
    try {
      const res = await axios.get("/api/viagens");
      setViagens(res.data);
    } catch (error) {
      console.error("Erro ao carregar viagens:", error);
    }
  };

  const criarViagem = async () => {
    try {
      await axios.post("/api/viagens", novaViagem);
      setNovaViagem({
        titulo: "",
        descricao: "",
        imagem: "",
        preco: "",
        vagas: 0,
        data: "",
      });
      carregarViagens();
    } catch (error) {
      console.error("Erro ao criar viagem:", error);
    }
  };

  const atualizarViagem = async () => {
    try {
      await axios.put(`/api/viagens/${editando._id}`, editando);
      setEditando(null);
      carregarViagens();
    } catch (error) {
      console.error("Erro ao atualizar viagem:", error);
    }
  };

  const deletarViagem = async (id) => {
    try {
      await axios.delete(`/api/viagens/${id}`);
      carregarViagens();
    } catch (error) {
      console.error("Erro ao deletar viagem:", error);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

      {/* Formulário para nova viagem */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Criar Nova Viagem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Título"
            className="p-2 border rounded"
            value={novaViagem.titulo}
            onChange={(e) =>
              setNovaViagem({ ...novaViagem, titulo: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="URL da Imagem"
            className="p-2 border rounded"
            value={novaViagem.imagem}
            onChange={(e) =>
              setNovaViagem({ ...novaViagem, imagem: e.target.value })
            }
          />
          <textarea
            placeholder="Descrição"
            className="p-2 border rounded md:col-span-2"
            rows="3"
            value={novaViagem.descricao}
            onChange={(e) =>
              setNovaViagem({ ...novaViagem, descricao: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Preço"
            className="p-2 border rounded"
            value={novaViagem.preco}
            onChange={(e) =>
              setNovaViagem({ ...novaViagem, preco: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Vagas"
            className="p-2 border rounded"
            value={novaViagem.vagas}
            onChange={(e) =>
              setNovaViagem({ ...novaViagem, vagas: e.target.value })
            }
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={novaViagem.data}
            onChange={(e) =>
              setNovaViagem({ ...novaViagem, data: e.target.value })
            }
          />
        </div>
        <button
          onClick={criarViagem}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FiPlus /> Criar Viagem
        </button>
      </div>

      {/* Lista de viagens existentes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Viagens Cadastradas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Título</th>
                <th className="py-2 px-4 border-b">Preço</th>
                <th className="py-2 px-4 border-b">Vagas</th>
                <th className="py-2 px-4 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {viagens.map((viagem) => (
                <tr key={viagem._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {editando?._id === viagem._id ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={editando.titulo}
                        onChange={(e) =>
                          setEditando({ ...editando, titulo: e.target.value })
                        }
                      />
                    ) : (
                      viagem.titulo
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editando?._id === viagem._id ? (
                      <input
                        type="text"
                        className="p-1 border rounded w-full"
                        value={editando.preco}
                        onChange={(e) =>
                          setEditando({ ...editando, preco: e.target.value })
                        }
                      />
                    ) : (
                      viagem.preco
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editando?._id === viagem._id ? (
                      <input
                        type="number"
                        className="p-1 border rounded w-full"
                        value={editando.vagas}
                        onChange={(e) =>
                          setEditando({ ...editando, vagas: e.target.value })
                        }
                      />
                    ) : (
                      viagem.vagas
                    )}
                  </td>
                  <td className="py-2 px-4 border-b flex gap-2">
                    {editando?._id === viagem._id ? (
                      <>
                        <button
                          onClick={atualizarViagem}
                          className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                          title="Salvar"
                        >
                          <FiSave />
                        </button>
                        <button
                          onClick={() => setEditando(null)}
                          className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                          title="Cancelar"
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
