const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarEmail(destinatario, assunto, mensagem) {
  await transporter.sendMail({
    from: `"Agência de Viagens" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: assunto,
    html: mensagem,
  });
}

module.exports = enviarEmail;
