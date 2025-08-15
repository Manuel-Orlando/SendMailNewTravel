require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./config/database");

// Inicializa agendador
require("./cron/limpezaReservas");

const app = express();

// Conecta ao banco
connectDB();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Alterado de import.meta.env para process.env
    credentials: true,
  })
);

app.use(express.json());

// Sessão (antes do Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET || "sua_chave_secreta_segura", // Usando variável de ambiente
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Ativa apenas em produção
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 dia
    },
  })
);

// Rotas
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const viagensRoutes = require("./routes/viagens");
app.use("/viagens", viagensRoutes);

const reservasRoutes = require("./routes/reservas");
app.use("/reservas", reservasRoutes);

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

const emailConfirmationRoutes = require("./routes/emailConfirmation");
app.use("/auth", emailConfirmationRoutes);

// Rota padrão
app.get("/", (req, res) => {
  res.send("API funcionando!");
});

// Inicializa servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`Frontend configurado para: ${process.env.FRONTEND_URL}`); // Log de verificação
});
