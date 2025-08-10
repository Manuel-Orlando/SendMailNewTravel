import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import ModalBase from "../../ui/ModalBase";

export default function LoginModal({ onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, senha);
      onClose();
    } catch (err) {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <ModalBase onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">
        Login
      </h2>
      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded"
      />
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </div>
    </ModalBase>
  );
}
