const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  email: { type: String, unique: true },
  dataNascimento: { type: Date, required: true },
  senha: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // Indica se o usuário verificou o email
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("Usuario", usuarioSchema);
