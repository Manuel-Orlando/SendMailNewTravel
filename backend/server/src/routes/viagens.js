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

// GET /viagens - listar todas as viagens
router.get("/", async (req, res) => {
  try {
    const viagens = await Viagem.find();
    res.status(200).json(viagens);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar viagens", detalhes: error.message });
  }
});

// GET /viagens/:id - buscar viagem por ID
router.get("/:id", async (req, res) => {
  try {
    const viagem = await Viagem.findById(req.params.id);
    if (!viagem) {
      return res.status(404).json({ erro: "Viagem não encontrada" });
    }
    res.status(200).json(viagem);
  } catch (error) {
    res
      .status(400)
      .json({ erro: "ID inválido ou erro na busca", detalhes: error.message });
  }
});

// PUT /viagens/:id - atualizar viagem existente
router.put("/:id", async (req, res) => {
  try {
    const viagemAtualizada = await Viagem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!viagemAtualizada) {
      return res
        .status(404)
        .json({ erro: "Viagem não encontrada para atualização" });
    }

    res.status(200).json(viagemAtualizada);
  } catch (error) {
    res
      .status(400)
      .json({ erro: "Erro ao atualizar viagem", detalhes: error.message });
  }
});

// DELETE /viagens/:id - remover viagem
router.delete("/:id", async (req, res) => {
  try {
    const viagemRemovida = await Viagem.findByIdAndDelete(req.params.id);

    if (!viagemRemovida) {
      return res
        .status(404)
        .json({ erro: "Viagem não encontrada para exclusão" });
    }

    res.status(200).json({ mensagem: "Viagem removida com sucesso" });
  } catch (error) {
    res
      .status(400)
      .json({ erro: "Erro ao remover viagem", detalhes: error.message });
  }
});

module.exports = router;
