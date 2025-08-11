import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { data, useNavigate } from "react-router-dom";
import ModalBase from "../../ui/ModalBase";

export default function RegisterModal({ onClose }) {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    dataNascimento: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginComToken } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nome, sobrenome, email, senha, confirmarSenha, dataNascimento } =
      formData;

    if (
      !nome ||
      !sobrenome ||
      !email ||
      !senha ||
      !confirmarSenha ||
      !dataNascimento
    ) {
      setError("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, sobrenome, email, senha, dataNascimento }),
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error("Erro ao cadastrar: " + erro);
      }

      const data = await response.json();
      loginComToken(data.token, data.usuario.nome);
      onClose();
      navigate("/");
    } catch (err) {
      setError(err.message || "Não foi possível cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBase onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Cadastro
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          name="sobrenome"
          placeholder="Sobrenome"
          value={formData.sobrenome}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="date"
          name="dataNascimento"
          placeholder="Data de nascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={formData.senha}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          name="confirmarSenha"
          placeholder="Confirmar senha"
          value={formData.confirmarSenha}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded transition ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
