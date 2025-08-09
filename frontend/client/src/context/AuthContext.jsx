import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");
    const nomeSalvo = localStorage.getItem("userName");

    if (tokenSalvo) setToken(tokenSalvo);
    if (nomeSalvo) setUserName(nomeSalvo);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await api.post("/auth/login", { email, senha });
      const { token, usuario } = response.data;

      setToken(token);
      setUserName(usuario?.nome || "Usuário");

      localStorage.setItem("token", token);
      localStorage.setItem("userName", usuario?.nome || "Usuário");
    } catch (error) {
      throw new Error("Credenciais inválidas");
    }
  };

  const loginComToken = (token, nome) => {
    setToken(token);
    setUserName(nome || "Usuário");
    localStorage.setItem("token", token);
    localStorage.setItem("userName", nome || "Usuário");
  };

  const logout = () => {
    setToken("");
    setUserName("");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider
      value={{ token, login, loginComToken, logout, userName, setUserName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
