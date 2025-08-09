const express = require("express");
const Reserva = require("../models/Reserva");
const autenticarToken = require("../middlewares/auth");

const router = express.Router();

// GET /reservas - listar todas as reservas
router.get("/reservas", autenticarToken, async (req, res) => {
  if (!req.usuario.isAdmin) {
    return res.status(403).json({ erro: "Acesso restrito ao administrador" });
  }

  const { destino, data } = req.query;

  try {
    // Monta filtro para viagem
    const viagemFiltro = {};
    if (destino) viagemFiltro.destino = { $regex: destino, $options: "i" };
    if (data) viagemFiltro.data = new Date(data);

    // Busca reservas com viagens que batem com os filtros
    const reservas = await Reserva.find().populate({
      path: "viagem",
      match: viagemFiltro,
    });

    // Remove reservas sem viagem (caso o filtro não bata)
    const filtradas = reservas.filter((r) => r.viagem);

    res.status(200).json(filtradas);
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar reservas com filtro",
      detalhes: error.message,
    });
  }
});

module.exports = router;
