const express = require("express");
const Viagem = require("../models/Viagem");
const Reserva = require("../models/Reserva");

const router = express.Router();

// Função para remover reservas com mais de 24h
async function removerReservasExpiradas() {
  const limite = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h atrás
  await Reserva.deleteMany({ dataCriacao: { $lt: limite } });
}

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

// GET /reservas - listar todas as reservas
router.get("/", async (req, res) => {
  try {
    await removerReservasExpiradas(); // limpa reservas antigas
    const reservas = await Reserva.find().populate("viagem");
    res.status(200).json(reservas);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar reservas", detalhes: error.message });
  }
});

// GET /reservas/:email - listar reservas de um cliente específico
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const reservas = await Reserva.find({ emailCliente: email }).populate(
      "viagem"
    );

    if (reservas.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Nenhuma reserva encontrada para este e-mail." });
    }

    res.status(200).json(reservas);
  } catch (error) {
    res
      .status(500)
      .json({
        erro: "Erro ao buscar reservas do cliente",
        detalhes: error.message,
      });
  }
});

module.exports = router;
