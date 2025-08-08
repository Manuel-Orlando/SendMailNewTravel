require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");

const app = express();
connectDB();

// ✅ Middlewares primeiro
app.use(cors());
app.use(express.json());

// ✅ Rota padrão
app.get("/", (req, res) => {
  res.send("API funcionando!");
});

// ✅ Inicialização do servidor
app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 4000}`);
});
