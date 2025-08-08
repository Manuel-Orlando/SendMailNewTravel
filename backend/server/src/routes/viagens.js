const express = require("express");
const Viagem = require("../models/Viagem");

const router = express.Router();

// POST /viagens - cadastrar nova viagem
router.post("/", async (req, res) => {
  try {
    const novaViagem = new Viagem(req.body);
    const viagemSalva = await novaViagem.save();
    res.status(201).json(viagemSalva);
  } catch (error) {
    res
      .status(400)
      .json({ erro: "Erro ao cadastrar viagem", detalhes: error.message });
  }
});

module.exports = router;
