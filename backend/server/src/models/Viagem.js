const mongoose = require("mongoose");

const viagemSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    vagasTotais: { type: Number, required: true },
    vagasDisponiveis: { type: Number, required: true },
    tags: [{ type: String }],
    imagem: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Viagem", viagemSchema);
