const express = require("express");
const { Parser } = require("json2csv");
const Reserva = require("../models/Reserva");
const Viagem = require("../models/Viagem");
const autenticar = require("../middlewares/auth"); // Atualize para usar o novo middleware

const router = express.Router();

// 🔐 Todas as rotas exigem admin (middleware global)
router.use(autenticar({ verificarAdmin: true }));

// --- ROTAS DE EXPORTAÇÃO ---
router.get("/reservas/exportar", async (req, res) => {
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
    res.status(500).json({
      erro: "Erro ao exportar reservas",
      detalhes: error.message,
    });
  }
});

// --- NOVAS ROTAS DE GESTÃO DE VIAGENS ---

// POST /admin/viagens - Criar nova viagem
router.post("/viagens", async (req, res) => {
  try {
    const { titulo, destino, descricao, data, preco, vagas } = req.body;

    const novaViagem = await Viagem.create({
      titulo,
      destino,
      descricao,
      data: new Date(data),
      preco,
      vagasDisponiveis: vagas,
      criadoPor: req.usuario.id,
    });

    res.status(201).json(novaViagem);
  } catch (error) {
    res.status(400).json({
      erro: "Erro ao criar viagem",
      detalhes: error.message,
    });
  }
});

// GET /admin/viagens - Listar todas (com paginação)
router.get("/viagens", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const viagens = await Viagem.find()
      .sort({ data: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Viagem.countDocuments();

    res.json({
      viagens,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar viagens",
      detalhes: error.message,
    });
  }
});

// PUT /admin/viagens/:id - Atualizar viagem
router.put("/viagens/:id", async (req, res) => {
  try {
    const viagemAtualizada = await Viagem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!viagemAtualizada) {
      return res.status(404).json({ erro: "Viagem não encontrada" });
    }

    res.json(viagemAtualizada);
  } catch (error) {
    res.status(400).json({
      erro: "Erro ao atualizar viagem",
      detalhes: error.message,
    });
  }
});

// DELETE /admin/viagens/:id - Remover viagem
router.delete("/viagens/:id", async (req, res) => {
  try {
    const viagem = await Viagem.findByIdAndDelete(req.params.id);

    if (!viagem) {
      return res.status(404).json({ erro: "Viagem não encontrada" });
    }

    // Opcional: Cancelar reservas associadas
    await Reserva.updateMany(
      { viagem: req.params.id },
      { status: "cancelada" }
    );

    res.json({ mensagem: "Viagem removida com sucesso" });
  } catch (error) {
    res.status(400).json({
      erro: "Erro ao remover viagem",
      detalhes: error.message,
    });
  }
});

module.exports = router;
