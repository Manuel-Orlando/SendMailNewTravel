const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    sobrenome: { type: String, required: true },
    email: { type: String, unique: true },
    dataNascimento: { type: Date, required: true },
    senha: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usuario", usuarioSchema);
