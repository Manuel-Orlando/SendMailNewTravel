const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const { enviarEmailConfirmacao } = require("../utils/email");
const autenticarToken = require("../middlewares/auth");

const router = express.Router();

// Registro
router.post("/registro", async (req, res) => {
  const { nome, sobrenome, email, dataNascimento, senha } = req.body;

  try {
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
      isVerified: false,
    });

    await novoUsuario.save();

    const tokenConfirmacao = jwt.sign(
      { id: novoUsuario._id, email: novoUsuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const resultadoEmail = await enviarEmailConfirmacao(
      novoUsuario.email,
      tokenConfirmacao
    );

    if (!resultadoEmail.sucesso) {
      return res.status(500).json({
        erro: "Erro ao enviar e-mail de confirmação.",
        detalhes: resultadoEmail.erro,
      });
    }

    console.log("✅ E-mail de confirmação enviado para:", novoUsuario.email);

    res.status(200).json({
      mensagem:
        "Cadastro realizado com sucesso. Verifique seu e-mail para confirmar.",
      usuario: {
        nome: novoUsuario.nome,
        sobrenome: novoUsuario.sobrenome,
        email: novoUsuario.email,
        dataNascimento: novoUsuario.dataNascimento,
      },
    });
  } catch (error) {
    console.error("❌ Erro no registro:", error);
    res
      .status(500)
      .json({ erro: "Erro ao registrar", detalhes: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    if (!usuario.isVerified) {
      return res.status(403).json({
        erro: "Confirme seu e-mail antes de fazer login",
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        isAdmin: usuario.isAdmin, // Inclui no payload
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      usuario: {
        nome: usuario.nome,
        email: usuario.email,
        isAdmin: usuario.isAdmin, // Retorna para o frontend
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res
      .status(500)
      .json({ erro: "Erro ao fazer login", detalhes: error.message });
  }
});

// Rota protegida atualizada
router.get("/usuario", autenticarToken(), async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select(
      "-senha -__v"
    ); // Remove campos sensíveis

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json({
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      isAdmin: usuario.isAdmin,
      dataNascimento: usuario.dataNascimento,
    });
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao buscar usuário", detalhes: error.message });
  }
});

// Nova rota para atualizar perfil (exemplo)
router.put("/usuario", autenticarToken(), async (req, res) => {
  try {
    const atualizado = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      req.body,
      { new: true }
    ).select("-senha -__v");

    res.json(atualizado);
  } catch (error) {
    res
      .status(400)
      .json({ erro: "Erro ao atualizar", detalhes: error.message });
  }
});

module.exports = router;
