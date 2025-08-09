const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(403).json({ erro: "Token inválido ou expirado" });
  }
}

module.exports = autenticarToken;
