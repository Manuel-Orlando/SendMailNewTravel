import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");
    if (tokenSalvo) setToken(tokenSalvo);
  }, []);

  const login = (novoToken) => {
    setToken(novoToken);
    localStorage.setItem("token", novoToken);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
