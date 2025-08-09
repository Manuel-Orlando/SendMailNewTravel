import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { useState } from "react";
import RegisterModal from "./auth/RegisterModal";

export default function Header() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  let nomeUsuario = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      nomeUsuario = decoded.nome || decoded.email || "Usuário";
    } catch (err) {
      console.error("Token inválido");
    }
  }

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
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/viagens" className="hover:underline">
            Viagens
          </Link>
          <Link to="/reservas" className="hover:underline">
            Minhas Reservas
          </Link>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
          >
            Cadastrar
          </button>

          {token ? (
            <>
              <span className="font-semibold">Olá, {nomeUsuario}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </motion.header>

      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
    </>
  );
}
