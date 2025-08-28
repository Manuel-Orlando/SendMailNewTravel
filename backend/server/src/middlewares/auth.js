const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

// Middleware básico (só verifica token)
function autenticarToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(403).json({ erro: "Token inválido ou expirado" });
  }
}

// Middleware para admin (verifica token E se é admin)
async function autenticarAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario || !usuario.isAdmin) {
      return res
        .status(403)
        .json({ erro: "Acesso restrito a administradores" });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(403).json({ erro: "Token inválido ou expirado" });
  }
}

module.exports = { autenticarToken, autenticarAdmin };
