const mongoose = require("mongoose");

const TesteSchema = new mongoose.Schema({
  nome: String,
  ativo: Boolean,
});

module.exports = mongoose.model("Teste", TesteSchema);
// backend/server/src/models/teste.js
