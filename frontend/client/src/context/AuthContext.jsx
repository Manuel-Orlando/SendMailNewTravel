import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");
    const nomeSalvo = localStorage.getItem("userName");
    const adminSalvo = JSON.parse(localStorage.getItem("isAdmin"));

    if (tokenSalvo) setToken(tokenSalvo);
    if (nomeSalvo) setUserName(nomeSalvo);
    if (adminSalvo !== null) setIsAdmin(adminSalvo);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await api.post("/auth/login", { email, senha });
      const { token, usuario } = response.data;

      setToken(token);
      setUserName(usuario?.nome || "Usuário");
      setIsAdmin(usuario?.isAdmin || false);

      localStorage.setItem("token", token);
      localStorage.setItem("userName", usuario?.nome || "Usuário");
      localStorage.setItem(
        "isAdmin",
        JSON.stringify(usuario?.isAdmin || false)
      );
    } catch (error) {
      throw new Error("Credenciais inválidas");
    }
  };

  const loginComToken = async (tokenRecebido) => {
    try {
      const response = await api.get("/auth/usuario", {
        headers: {
          Authorization: `Bearer ${tokenRecebido}`,
        },
      });

      const usuario = response.data;

      setToken(tokenRecebido);
      setUserName(usuario?.nome || "Usuário");
      setIsAdmin(usuario?.isAdmin || false);

      localStorage.setItem("token", tokenRecebido);
      localStorage.setItem("userName", usuario?.nome || "Usuário");
      localStorage.setItem("isAdmin", usuario?.isAdmin || false);
    } catch (error) {
      console.error("Token inválido ou expirado");
      logout(); // Limpa tudo se o token for inválido
    }
  };

  const logout = () => {
    setToken("");
    setUserName("");
    setIsAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        loginComToken,
        logout,
        userName,
        setUserName,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
