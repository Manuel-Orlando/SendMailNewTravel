import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";
import UserModal from "./auth/UserModal";

export default function Header() {
  const { token, logout, userName, loginComToken } = useAuth(); // Certifique-se de que loginComToken existe no AuthContext
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token");

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Abrir modal de login automaticamente se vier de /cadastro-sucesso
  useEffect(() => {
    if (location.state?.abrirLogin) {
      setShowLoginModal(true);
    }
  }, [location.state]);

  // Login automático com token da URL
  useEffect(() => {
    if (tokenParam) {
      loginComToken(tokenParam); // Essa função deve salvar o token e buscar os dados do usuário
      navigate("/", { replace: true }); // Redireciona para a home sem manter o token na URL
    }
  }, [tokenParam, loginComToken, navigate]);

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

          {!token ? (
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
          ) : (
            <>
              <button
                onClick={() => setShowUserModal(true)}
                className="font-semibold hover:underline transition"
              >
                Olá, {userName || "Usuário"}
              </button>
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
      {showUserModal && <UserModal onClose={() => setShowUserModal(false)} />}
    </>
  );
}
