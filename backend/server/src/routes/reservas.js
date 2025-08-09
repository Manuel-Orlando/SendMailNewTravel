const express = require("express");
const Viagem = require("../models/Viagem");
const Reserva = require("../models/Reserva");

const router = express.Router();

// POST /reservas - criar nova reserva
router.post("/", async (req, res) => {
  const { viagem, nomePassageiro, email, quantidade } = req.body;

  try {
    const viagemSelecionada = await Viagem.findById(viagem);

    if (!viagemSelecionada) {
      return res.status(404).json({ erro: "Viagem não encontrada" });
    }

    if (quantidade > viagemSelecionada.vagasDisponiveis) {
      return res
        .status(400)
        .json({ erro: "Não há vagas suficientes disponíveis" });
    }

    // Criar reserva
    const novaReserva = new Reserva({
      viagem,
      nomePassageiro,
      email,
      quantidade,
      status: "confirmada",
    });

    const reservaSalva = await novaReserva.save();

    // Atualizar vagas disponíveis
    viagemSelecionada.vagasDisponiveis -= quantidade;
    await viagemSelecionada.save();

    res.status(201).json(reservaSalva);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao criar reserva", detalhes: error.message });
  }
});

module.exports = router;
