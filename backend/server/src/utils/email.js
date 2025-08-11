const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // ou outro serviço
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarEmailConfirmacao(destinatario, token) {
  const link = `${process.env.FRONTEND_URL}/confirmar-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: "Confirmação de Cadastro",
    html: `<p>Olá! Clique no link abaixo para confirmar seu cadastro:</p><a href="${link}">${link}</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado:", info.response);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
  }
}

module.exports = { enviarEmailConfirmacao };
