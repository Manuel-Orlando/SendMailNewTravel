import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css"; // se estiver usando Tailwind ou estilos globais

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
