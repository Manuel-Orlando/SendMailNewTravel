import { createContext, useContext, useState, useEffect } from "react";
import api from "../../src/utils/api";

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

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      setToken(token);
      setUserName(user?.name || "Usuário");

      localStorage.setItem("token", token);
      localStorage.setItem("userName", user?.name || "Usuário");
    } catch (error) {
      throw new Error("Credenciais inválidas");
    }
  };

  const logout = () => {
    setToken("");
    setUserName("");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, userName, setUserName }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
