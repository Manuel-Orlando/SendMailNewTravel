import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
// Versão com aviso
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { token, isAdmin } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <Navigate
        to="/"
        state={{
          from: location,
          error: "Acesso restrito a administradores",
        }}
        replace
      />
    );
  }

  return children;
}
