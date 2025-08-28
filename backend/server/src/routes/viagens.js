const express = require("express");
const mongoose = require("mongoose");
const Viagem = require("../models/Viagem");
const { autenticarAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post("/", autenticarAdmin, async (req, res) => {
  console.log("📍 POST /viagens recebido (SEM AUTH)- Dados:", req.body);
  try {
    const { titulo, descricao, preco, vagasDisponiveis, data } = req.body;

    if (!titulo || !descricao || !preco || !vagasDisponiveis || !data) {
      return res
        .status(400)
        .json({ erro: "Preencha todos os campos obrigatórios" });
    }

    const novaViagem = new Viagem({
      titulo,
      descricao,
      imagem: req.body.imagem || "https://via.placeholder.com/300x200",
      preco,
      vagasDisponiveis,
      vagasTotais: vagasDisponiveis,
      data,
    });
    console.log("Antes de salvar no banco");
    const viagemSalva = await novaViagem.save();
    console.log("Salvo com ID:", viagemSalva._id);
    res.status(201).json(viagemSalva);
  } catch (error) {
    console.error("Erro no save:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        erro: "Erro de validação",
        detalhes: Object.values(error.errors).map((e) => e.message),
      });
    }
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

router.get("/", async (req, res) => {
  console.log("GET /viagens recebido"); // Adicione este log
  try {
    const viagens = await Viagem.find().sort({ createdAt: -1 });
    console.log(`Encontradas ${viagens.length} viagens`); // Log para debug
    res.status(200).json(viagens);
  } catch (error) {
    console.error("Erro no GET /viagens:", error);
    res.status(500).json({ erro: error.message });
  }
});

router.put("/:id", autenticarAdmin, async (req, res) => {
  try {
    const viagemAtualizada = await Viagem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(viagemAtualizada);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

router.delete("/:id", autenticarAdmin, async (req, res) => {
  try {
    await Viagem.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensagem: "Viagem removida com sucesso" });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

module.exports = router;
