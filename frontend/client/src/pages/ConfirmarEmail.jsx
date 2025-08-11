import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmarEmail = () => {
  const [searchParams] = useSearchParams();
  const [mensagem, setMensagem] = useState("⏳ Validando seu email...");
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    const confirmarEmail = async () => {
      try {
        const resposta = await axios.post(
          "http://localhost:3001/confirmar-email",
          { token }
        );
        setMensagem(
          resposta.data.mensagem || "✅ Email confirmado com sucesso!"
        );
        setSucesso(true);

        // Redireciona após 3 segundos
        setTimeout(() => {
          navigate("/login"); // ou qualquer rota que faça sentido
        }, 3000);
      } catch (erro) {
        setMensagem(
          erro.response?.data?.mensagem || "❌ Erro ao confirmar o email."
        );
        setSucesso(false);
      }
    };

    if (token) {
      confirmarEmail();
    } else {
      setMensagem("⚠️ Token não encontrado na URL.");
    }
  }, [token, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: sucesso ? "#e0ffe0" : "#ffe0e0",
        color: "#333",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h2>{mensagem}</h2>
      <p style={{ marginTop: "1rem", fontSize: "1rem" }}>
        {sucesso
          ? "Você será redirecionado em instantes..."
          : "Verifique o link ou tente novamente."}
      </p>
    </div>
  );
};

export default ConfirmarEmail;
