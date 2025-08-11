const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const router = express.Router();

// Registro tradicional
router.post("/registro", async (req, res) => {
  const { nome, sobrenome, email, dataNascimento, senha } = req.body;

  try {
    // Validação básica
    if (!nome || !sobrenome || !email || !dataNascimento || !senha) {
      return res
        .status(400)
        .json({ erro: "Preencha todos os campos obrigatórios." });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ erro: "Usuário já existe." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({
      nome,
      sobrenome,
      email,
      dataNascimento,
      senha: senhaHash,
    });
    await novoUsuario.save();

    const token = jwt.sign(
      { id: novoUsuario._id, email: novoUsuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      usuario: {
        nome: novoUsuario.nome,
        sobrenome: novoUsuario.sobrenome,
        email: novoUsuario.email,
        dataNascimento: novoUsuario.dataNascimento,
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
  try {
    const { email, senha } = req.body;

    // Verifica se os campos foram enviados
    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    // Busca o usuário no banco
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Verifica se o campo de senha existe
    if (!usuario.senha) {
      return res
        .status(500)
        .json({ erro: "Usuário não possui senha cadastrada" });
    }

    // Compara a senha enviada com o hash salvo
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Token gerado:", token);

    return res.status(200).json({
      token,
      usuario: {
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res
      .status(500)
      .json({ erro: "Erro ao fazer login", detalhes: error.message });
  }
});

module.exports = router;
