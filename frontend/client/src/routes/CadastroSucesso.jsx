import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { MdEmail, MdLogin, MdReplay } from "react-icons/md";

const CadastroSucesso = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const [reenvioMsg, setReenvioMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleReenvio = async () => {
    if (!email) return;
    setIsLoading(true);
    setReenvioMsg("⏳ Reenviando...");
    try {
      const res = await fetch(`${API_URL}/reenviar-confirmacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setReenvioMsg(data.mensagem || "✅ E-mail reenviado!");
    } catch (err) {
      setReenvioMsg("❌ Erro ao reenviar e-mail.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-blue-900 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
        className="mb-4"
      >
        <MdEmail size={64} className="text-blue-600" />
      </motion.div>

      <motion.h2
        className="text-2xl font-bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Cadastro realizado com sucesso!
      </motion.h2>

      <motion.p
        className="mt-2 text-sm max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Enviamos um e-mail de confirmação para <strong>{email}</strong>. Por
        favor, confirme seu e-mail antes de fazer login.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 flex flex-col items-center gap-4"
      >
        <Link
          to="/login"
          state={{ abrirLogin: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <MdLogin size={20} />
          Ir para login
        </Link>

        <button
          onClick={handleReenvio}
          disabled={isLoading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition ${
            isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-100 hover:bg-blue-200 text-blue-700"
          }`}
        >
          <MdReplay size={20} />
          Reenviar confirmação
        </button>

        {reenvioMsg && <p className="text-sm text-gray-700">{reenvioMsg}</p>}
      </motion.div>
    </motion.div>
  );
};

export default CadastroSucesso;
