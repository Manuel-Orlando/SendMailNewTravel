import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";
import UserModal from "./auth/UserModal";
import {
  FiMenu,
  FiX,
  FiHome,
  FiMap,
  FiUserPlus,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiClipboard,
} from "react-icons/fi";

export default function Header() {
  const { token, logout, userName, loginComToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token");

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (location.state?.abrirLogin) {
      setShowLoginModal(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (tokenParam) {
      loginComToken(tokenParam);
      navigate("/", { replace: true });
    }
  }, [tokenParam, loginComToken, navigate]);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-blue-600 text-white px-6 py-4 shadow-md relative z-50"
      >
        <div className="flex items-center justify-between w-full">
          {/* Esquerda: Logo */}
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              ✈️ Agência de Viagens
            </h1>
          </div>

          {/* Centro: Navegação pública (visível apenas em md+) */}
          <div className="hidden md:flex flex-1 justify-center gap-6">
            <button
              className="hover:text-blue-200 flex items-center gap-1"
              onClick={() => navigate("/")}
            >
              <FiHome /> Home
            </button>
            <button
              className="hover:text-blue-200 flex items-center gap-1"
              onClick={() => navigate("/viagens")}
            >
              <FiMap /> Viagens
            </button>
          </div>

          {/* Direita: Área do usuário (visível apenas em md+) */}
          <div className="hidden md:flex flex-1 justify-end">
            <div className="flex items-center gap-3">
              {!token ? (
                <>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition flex items-center gap-1"
                  >
                    <FiUserPlus /> Cadastrar
                  </button>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition flex items-center gap-1"
                  >
                    <FiLogIn /> Login
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/reservas")}
                    className="hover:text-blue-200 flex items-center gap-1"
                  >
                    <FiClipboard /> Minhas Reservas
                  </button>
                  <button
                    onClick={() => setShowUserModal(true)}
                    className="font-semibold hover:text-blue-200 transition flex items-center gap-1"
                  >
                    <FiUser /> Olá, {userName || "Usuário"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition flex items-center gap-1"
                  >
                    <FiLogOut /> Sair
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Botão hamburguer (visível apenas em telas pequenas) */}
          <div className="md:hidden">
            <button
              className="text-2xl text-white"
              onClick={() => setMenuAberto(true)}
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Overlay escurecido */}
      <AnimatePresence>
        {menuAberto && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMenuAberto(false)}
            />

            {/* Drawer lateral */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 w-64 h-full bg-blue-600 text-white p-6 z-50 shadow-lg flex flex-col gap-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Menu</h2>
                <button
                  onClick={() => setMenuAberto(false)}
                  className="text-2xl"
                >
                  <FiX />
                </button>
              </div>

              <button
                className="hover:text-blue-200 flex items-center gap-2"
                onClick={() => {
                  navigate("/");
                  setMenuAberto(false);
                }}
              >
                <FiHome /> Home
              </button>
              <button
                className="hover:text-blue-200 flex items-center gap-2"
                onClick={() => {
                  navigate("/viagens");
                  setMenuAberto(false);
                }}
              >
                <FiMap /> Viagens
              </button>
              {token && (
                <button
                  className="hover:text-blue-200 flex items-center gap-2"
                  onClick={() => {
                    navigate("/reservas");
                    setMenuAberto(false);
                  }}
                >
                  <FiClipboard /> Minhas Reservas
                </button>
              )}
              {!token ? (
                <>
                  <button
                    onClick={() => {
                      setShowRegisterModal(true);
                      setMenuAberto(false);
                    }}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition flex items-center gap-2"
                  >
                    <FiUserPlus /> Cadastrar
                  </button>
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      setMenuAberto(false);
                    }}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition flex items-center gap-2"
                  >
                    <FiLogIn /> Login
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowUserModal(true);
                      setMenuAberto(false);
                    }}
                    className="hover:text-blue-200 flex items-center gap-2"
                  >
                    <FiUser /> Olá, {userName || "Usuário"}
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuAberto(false);
                    }}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition flex items-center gap-2"
                  >
                    <FiLogOut /> Sair
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modais */}
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
