const express = require("express");
const Viagem = require("../models/Viagem");
const Reserva = require("../models/Reserva");

const router = express.Router();
const autenticarToken = require("../middlewares/auth");

function emailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Função para remover reservas com mais de 24h
async function removerReservasExpiradas() {
  const limite = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h atrás
  await Reserva.deleteMany({ dataCriacao: { $lt: limite } });
}

// POST /reservas - criar nova reserva
router.post("/", autenticarToken, async (req, res) => {
  const { viagem, nomePassageiro, quantidade } = req.body;
  const email = req.usuario.email; // vem do token

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

    const novaReserva = new Reserva({
      viagem,
      nomeCliente: nomePassageiro,
      emailCliente: email,
      quantidade,
      status: "confirmada",
    });

    const reservaSalva = await novaReserva.save();

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
router.get("/:email", autenticarToken, async (req, res) => {
  const { email } = req.params;

  if (req.usuario.email !== email) {
    return res
      .status(403)
      .json({ erro: "Acesso negado às reservas de outro usuário" });
  }

  if (!emailValido(email)) {
    return res.status(400).json({ erro: "Formato de e-mail inválido." });
  }

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
    res.status(500).json({
      erro: "Erro ao buscar reservas do cliente",
      detalhes: error.message,
    });
  }
});

// DELETE /reservas/:id - cancelar uma reserva
router.delete("/:id", autenticarToken, async (req, res) => {
  const { id } = req.params;

  try {
    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return res.status(404).json({ erro: "Reserva não encontrada" });
    }

    // Verifica se o usuário é dono da reserva
    if (reserva.emailCliente !== req.usuario.email) {
      return res
        .status(403)
        .json({ erro: "Você não tem permissão para cancelar esta reserva" });
    }

    // Atualiza vagas da viagem
    const viagem = await Viagem.findById(reserva.viagem);
    if (viagem) {
      viagem.vagasDisponiveis += reserva.quantidade;
      await viagem.save();
    }

    // Remove a reserva
    await reserva.deleteOne();

    res.status(200).json({ mensagem: "Reserva cancelada com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao cancelar reserva", detalhes: error.message });
  }
});

module.exports = router;
