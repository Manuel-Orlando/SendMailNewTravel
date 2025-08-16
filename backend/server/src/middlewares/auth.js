const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario"); // Adicione esta linha

// Middleware principal (agora com verificação opcional de admin)
function autenticarToken(opcoes = { verificarAdmin: false }) {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ erro: "Token não fornecido" });
    }

    try {
      // 1. Verifica o token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 2. Busca o usuário no banco (opcional para verificação de admin)
      let usuario;
      if (opcoes.verificarAdmin) {
        usuario = await Usuario.findById(decoded.id);
        if (!usuario) {
          return res.status(401).json({ erro: "Usuário não encontrado" });
        }
      }

      // 3. Verifica se é admin (se necessário)
      if (opcoes.verificarAdmin && !usuario.isAdmin) {
        return res
          .status(403)
          .json({ erro: "Acesso restrito a administradores" });
      }

      // 4. Adiciona informações ao request
      req.usuario = usuario || decoded; // Usa o usuário do banco ou o payload do token
      next();
    } catch (error) {
      console.error("Erro na autenticação:", error);
      res.status(403).json({ erro: "Token inválido ou expirado" });
    }
  };
}

module.exports = autenticarToken;
