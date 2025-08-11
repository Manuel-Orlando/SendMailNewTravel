const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // ou outro serviço
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarEmailConfirmacao(destinatario, token) {
  const link = `http://localhost:3000/confirmar-email?token=${token}`; // ajuste para seu frontend

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: "Confirmação de Cadastro",
    html: `<p>Olá! Clique no link abaixo para confirmar seu cadastro:</p><a href="${link}">${link}</a>`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { enviarEmailConfirmacao };
