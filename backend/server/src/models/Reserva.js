const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
  viagem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Viagem",
    required: true,
  },
  nomeCliente: { type: String, required: true },
  emailCliente: { type: String, required: true },
  quantidade: { type: Number, required: true },
  status: { type: String, default: "pendente" },
  dataCriacao: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reserva", reservaSchema);
