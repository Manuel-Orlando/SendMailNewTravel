import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { MdCheckCircle, MdErrorOutline } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ConfirmarEmail = () => {
  const [searchParams] = useSearchParams();
  const [mensagem, setMensagem] = useState("⏳ Validando seu email...");
  const [sucesso, setSucesso] = useState(null); // null = carregando
  const [mostrarReenvio, setMostrarReenvio] = useState(false);
  const [email, setEmail] = useState("");
  const [reenvioMsg, setReenvioMsg] = useState("");
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const confirmarEmail = async () => {
      try {
        const resposta = await axios.get(
          `${API_URL}/auth/confirmar-email?token=${token}`
        );

        setMensagem(
          resposta.data.mensagem || "✅ Email confirmado com sucesso!"
        );
        setSucesso(true);

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (erro) {
        setMensagem(
          erro.response?.data?.mensagem || "❌ Erro ao confirmar o email."
        );
        setSucesso(false);
        setMostrarReenvio(true);
      }
    };

    if (token) {
      confirmarEmail();
    } else {
      setMensagem("⚠️ Token não encontrado na URL.");
      setSucesso(false);
      setMostrarReenvio(true);
    }
  }, [token, navigate, API_URL]);

  const handleReenvio = async (e) => {
    e.preventDefault();
    setReenvioMsg("⏳ Enviando...");
    try {
      const resposta = await axios.post(
        `${API_URL}/auth/reenviar-confirmacao`,
        { email }
      );
      setReenvioMsg(resposta.data.mensagem || "✅ E-mail reenviado!");
    } catch (erro) {
      setReenvioMsg(
        erro.response?.data?.mensagem || "❌ Erro ao reenviar e-mail."
      );
    }
  };

  const renderIcon = () => {
    if (sucesso === null) {
      return (
        <motion.div
          className="mb-4 text-blue-500 animate-spin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AiOutlineLoading3Quarters size={40} />
        </motion.div>
      );
    }
    return sucesso ? (
      <motion.div
        className="text-green-600 mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <MdCheckCircle size={48} />
      </motion.div>
    ) : (
      <motion.div
        className="text-red-600 mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <MdErrorOutline size={48} />
      </motion.div>
    );
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all duration-500 ${
        sucesso === true
          ? "bg-green-50 text-green-800"
          : sucesso === false
          ? "bg-red-50 text-red-800"
          : "bg-white text-gray-800"
      }`}
    >
      {renderIcon()}
      <motion.h2
        className="text-2xl font-semibold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {mensagem}
      </motion.h2>
      <p className="mt-2 text-sm">
        {sucesso === true
          ? "Você será redirecionado em instantes..."
          : sucesso === false
          ? "Verifique o link ou tente novamente."
          : ""}
      </p>

      {mostrarReenvio && (
        <motion.form
          onSubmit={handleReenvio}
          className="mt-6 flex flex-col items-center gap-2 w-full max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Reenviar confirmação
          </button>
          {reenvioMsg && (
            <p className="text-sm mt-2 text-gray-600">{reenvioMsg}</p>
          )}
        </motion.form>
      )}
    </div>
  );
};

export default ConfirmarEmail;
