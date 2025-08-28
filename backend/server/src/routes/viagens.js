const express = require("express");
const mongoose = require("mongoose");
const Viagem = require("../models/Viagem");
const { autenticarAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/:id", async (req, res) => {
  console.log("📍 GET /viagens/:id recebido - ID:", req.params.id);
  try {
    const viagem = await Viagem.findById(req.params.id);

    if (!viagem) {
      return res.status(404).json({ erro: "Viagem não encontrada" });
    }

    res.status(200).json(viagem);
  } catch (error) {
    console.error("Erro ao buscar viagem:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ erro: "ID inválido" });
    }

    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

router.post("/", autenticarAdmin, async (req, res) => {
  console.log("📍 POST /viagens recebido - Dados:", req.body);
  try {
    const {
      titulo,
      descricao,
      preco,
      precoOriginal,
      vagasDisponiveis,
      data,
      localEmbarque,
      guiaTuristico,
      cafeDaManha,
    } = req.body;

    if (
      !titulo ||
      !descricao ||
      !preco ||
      !vagasDisponiveis ||
      !data ||
      !localEmbarque
    ) {
      return res
        .status(400)
        .json({ erro: "Preencha todos os campos obrigatórios" });
    }

    // Formata a data
    const formatarData = (dataString) => {
      const partes = dataString.split("-");
      if (partes.length !== 3) return dataString;

      const [ano, mes, dia] = partes;
      const meses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      return `${dia} de ${meses[parseInt(mes) - 1]}`;
    };

    const novaViagem = new Viagem({
      titulo,
      descricao,
      imagem: req.body.imagem || "https://via.placeholder.com/300x200",
      preco,
      precoOriginal: precoOriginal || preco,
      vagasDisponiveis,
      vagasTotais: vagasDisponiveis,
      data,
      dataFormatada: formatarData(data),
      localEmbarque,
      guiaTuristico: guiaTuristico || false,
      cafeDaManha: cafeDaManha || false,
    });

    const viagemSalva = await novaViagem.save();
    res.status(201).json(viagemSalva);
  } catch (error) {
    console.error("Erro no save:", error);
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
