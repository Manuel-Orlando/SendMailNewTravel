require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");

// Apenas importa para iniciar o agendador
require("./cron/limpezaReservas");

const app = express();
connectDB();

// ✅ Middlewares primeiro
app.use(cors());
app.use(express.json());

// ✅ Rotas
const viagensRoutes = require("./routes/viagens");
app.use("/viagens", viagensRoutes);

const reservasRoutes = require("./routes/reservas");
app.use("/reservas", reservasRoutes);

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

// ✅ Rota padrão
app.get("/", (req, res) => {
  res.send("API funcionando!");
});

// ✅ Inicialização do servidor
app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 4000}`);
});
