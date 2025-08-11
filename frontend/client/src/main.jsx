import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ConfirmarEmail from "./routes/ConfirmarEmail";
import CadastroSucesso from "./routes/CadastroSucesso";
import "./styles/index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/SendMailNewTravel/">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<App />} />
          <Route path="/cadastro" element={<App />} />
          <Route path="/cadastro-sucesso" element={<CadastroSucesso />} />
          <Route path="/confirmar-email" element={<ConfirmarEmail />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
