const mongoose = require("mongoose");

const viagemSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true, maxlength: 500 }, // Limite de 500 caracteres
    imagem: { type: String, default: "https://via.placeholder.com/300x200" },
    preco: { type: Number, required: true }, // Alterado para Number
    precoOriginal: { type: Number, required: true }, // Para calcular parcelas
    vagasDisponiveis: { type: Number, required: true, min: 0 },
    vagasTotais: { type: Number, required: true, min: 0 },
    data: { type: String, required: true },
    dataFormatada: { type: String }, // Novo campo para data formatada
    localEmbarque: { type: String, required: true }, // Novo campo obrigatório
    guiaTuristico: { type: Boolean, default: false }, // Alterado para Boolean
    cafeDaManha: { type: Boolean, default: false }, // Alterado para Boolean
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Viagem", viagemSchema);
