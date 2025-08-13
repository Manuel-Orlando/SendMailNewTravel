const mongoose = require("mongoose");

const viagemSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    imagem: { type: String },
    data: { type: String },
    vagasTotais: { type: Number },
    vagasDisponiveis: { type: Number },
    guiaTuristico: { type: String },
    cafeDaManha: { type: String },
    localEmbarque: { type: String },
    preco: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Viagem", viagemSchema);
