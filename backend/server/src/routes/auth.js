const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const passport = require("passport");

const router = express.Router();

// Registro tradicional
router.post("/registro", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Validação básica
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ erro: "Preencha todos os campos obrigatórios." });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ erro: "Usuário já existe." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({ nome, email, senha: senhaHash });
    await novoUsuario.save();

    const token = jwt.sign(
      { id: novoUsuario._id, email: novoUsuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      usuario: {
        nome: novoUsuario.nome,
        email: novoUsuario.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao registrar", detalhes: error.message });
  }
});

// Login tradicional
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Token gerado:", token);

    res.status(200).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao fazer login", detalhes: error.message });
  }
});

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
  }),
  (req, res) => {
    res.redirect(`http://localhost:5173/oauth?token=${req.user.token}`);
  }
);

module.exports = router;
