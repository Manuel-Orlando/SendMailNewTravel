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

      localStorage.setItem("token", token);
      localStorage.setItem("userName", usuario?.nome || "Usuário");
      localStorage.setItem(
        "isAdmin",
        JSON.stringify(usuario?.isAdmin || false)
      );

      setToken(token);
      setUserName(usuario?.nome || "Usuário");
      setIsAdmin(usuario?.isAdmin || false);

      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Credenciais inválidas");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("isAdmin");
    setToken("");
    setUserName("");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        userName,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
