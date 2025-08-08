require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const app = express();
connectDB();

// ✅ Middlewares primeiro
app.use(cors());
app.use(express.json());

// ✅ Model
const Teste = require("./models/teste");

// ✅ Rota de teste
app.post("/teste", async (req, res) => {
  try {
    const novo = await Teste.create({ nome: "Manuel", ativo: true });
    res.json(novo);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao salvar" });
  }
});

// ✅ Rota padrão
app.get("/", (req, res) => {
  res.send("API funcionando!");
});

// ✅ Inicialização do servidor
app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 4000}`);
});
