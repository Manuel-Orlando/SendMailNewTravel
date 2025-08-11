const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const { enviarEmailConfirmacao } = require("../utils/email");

// Confirmação de e-mail
router.get("/confirmar-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token não fornecido.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(404).send("Usuário não encontrado.");
    }

    if (!usuario.isVerified) {
      usuario.isVerified = true;
      await usuario.save();
    }

    const tokenLogin = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/login?token=${tokenLogin}`
    );
  } catch (error) {
    console.error("❌ Erro ao confirmar email:", error);
    const mensagemErro =
      error.name === "TokenExpiredError"
        ? "Token expirado. Solicite um novo."
        : "Token inválido.";
    return res.status(400).send(mensagemErro);
  }
});

// Reenvio de confirmação
router.post("/reenviar-confirmacao", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ mensagem: "Email é obrigatório." });
  }

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    if (usuario.isVerified) {
      return res.status(200).json({ mensagem: "Email já está confirmado." });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const resultadoEmail = await enviarEmailConfirmacao(usuario.email, token);
    if (!resultadoEmail.sucesso) {
      return res.status(500).json({
        mensagem: "Erro ao reenviar e-mail.",
        detalhes: resultadoEmail.erro,
      });
    }

    return res.status(200).json({ mensagem: "E-mail reenviado com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao reenviar confirmação:", error);
    return res.status(500).json({
      mensagem: "Erro interno ao processar solicitação.",
      detalhes: error.message,
    });
  }
});

module.exports = router;
