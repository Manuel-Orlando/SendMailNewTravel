import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ConfirmarEmail from "./pages/ConfirmarEmail";
import "./styles/index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/SendMailNewTravel/">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/confirmar-email" element={<ConfirmarEmail />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
