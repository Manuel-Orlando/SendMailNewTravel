// src/config/passport.js
console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID);
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/Usuario");

passport.serializeUser((user, done) => {
  done(null, user.id); // salva o ID na sessão
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user); // recupera o usuário da sessão
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Verifica se o usuário já existe
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // Se não existir, cria um novo
          user = await User.create({
            githubId: profile.id,
            username: profile.username,
            avatar: profile.photos[0].value,
            email: profile.emails?.[0]?.value || null,
          });
        }

        // Finaliza a autenticação
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
