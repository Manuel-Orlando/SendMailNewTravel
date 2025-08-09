const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nome: { type: String }, // usado para login tradicional
  email: { type: String, unique: true },
  senha: { type: String }, // só obrigatório no login tradicional
  isAdmin: { type: Boolean, default: false },

  // Campos para login via GitHub
  githubId: { type: String, unique: true, sparse: true },
  username: { type: String },
  avatar: { type: String },
});

module.exports = mongoose.model("Usuario", usuarioSchema);
