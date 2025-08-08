const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema(
  {
    viagem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Viagem",
      required: true,
    },
    nomePassageiro: { type: String, required: true },
    email: { type: String, required: true },
    quantidade: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmada", "pendente", "cancelada"],
      default: "pendente",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reserva", reservaSchema);
