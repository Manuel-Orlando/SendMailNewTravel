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
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);

app.use(express.json());

// Sessão (antes do Passport)
app.use(
  session({
    secret: "sua_chave_secreta_segura", // troque por algo forte em produção
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true se estiver usando HTTPS
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
app.use("/", emailConfirmationRoutes);

// Rota padrão
app.get("/", (req, res) => {
  res.send("API funcionando!");
});

// Inicializa servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
