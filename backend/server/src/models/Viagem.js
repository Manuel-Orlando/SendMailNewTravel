const mongoose = require("mongoose");

const viagemSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    imagem: { type: String, default: "https://via.placeholder.com/300x200" },
    preco: { type: String, required: true },
    vagasDisponiveis: { type: Number, required: true, min: 0 },
    vagasTotais: { type: Number, required: true, min: 0 },
    data: { type: String, required: true },
    guiaTuristico: String,
    cafeDaManha: String,
    localEmbarque: String,
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Viagem", viagemSchema);
