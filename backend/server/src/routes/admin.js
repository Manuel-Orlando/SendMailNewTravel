const express = require("express");
const Reserva = require("../models/Reserva");
const autenticarToken = require("../middlewares/auth");

const router = express.Router();

// GET /reservas - listar todas as reservas
const { Parser } = require("json2csv");

router.get("/reservas/exportar", autenticarToken, async (req, res) => {
  if (!req.usuario.isAdmin) {
    return res.status(403).json({ erro: "Acesso restrito ao administrador" });
  }

  try {
    const reservas = await Reserva.find().populate("viagem");

    const dados = reservas.map((r) => ({
      nomeCliente: r.nomeCliente,
      emailCliente: r.emailCliente,
      quantidade: r.quantidade,
      status: r.status,
      dataReserva: r.createdAt.toISOString(),
      viagem: r.viagem?.titulo || "N/A",
      destino: r.viagem?.destino || "N/A",
      dataViagem: r.viagem?.data?.toISOString() || "N/A",
    }));

    const parser = new Parser();
    const csv = parser.parse(dados);

    res.header("Content-Type", "text/csv");
    res.attachment("reservas.csv");
    res.send(csv);
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao exportar reservas", detalhes: error.message });
  }
});

module.exports = router;
