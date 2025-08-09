const express = require("express");
const Reserva = require("../models/Reserva");
const autenticarToken = require("../middlewares/auth");

const router = express.Router();

router.get("/reservas", autenticarToken, async (req, res) => {
  if (!req.usuario.isAdmin) {
    return res.status(403).json({ erro: "Acesso restrito ao administrador" });
  }

  try {
    const reservas = await Reserva.find().populate("viagem");
    res.status(200).json(reservas);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar reservas", detalhes: error.message });
  }
});

module.exports = router;
