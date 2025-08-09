import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";

export default function Header() {
  const { token, logout, userName } = useAuth();
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-md"
      >
        <h1 className="text-xl font-bold">✈️ Agência de Viagens</h1>
        <nav className="flex items-center gap-6">
          <button className="hover:underline" onClick={() => navigate("/")}>
            Home
          </button>
          <button
            className="hover:underline"
            onClick={() => navigate("/viagens")}
          >
            Viagens
          </button>
          <button
            className="hover:underline"
            onClick={() => navigate("/reservas")}
          >
            Minhas Reservas
          </button>

          {!token && (
            <>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
              >
                Cadastrar
              </button>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
              >
                Login
              </button>
            </>
          )}

          {token && (
            <>
              <span className="font-semibold">
                Olá, {userName || "Usuário"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
              >
                Sair
              </button>
            </>
          )}
        </nav>
      </motion.header>

      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
