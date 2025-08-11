const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

router.get("/confirmar-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ erro: "Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    if (usuario.isVerified) {
      return res.status(200).json({ mensagem: "Usuário já confirmado." });
    }

    usuario.isVerified = true;
    await usuario.save();

    return res.status(200).json({ mensagem: "E-mail confirmado com sucesso!" });
  } catch (error) {
    return res.status(400).json({ erro: "Token inválido ou expirado." });
  }
});
module.exports = router;
