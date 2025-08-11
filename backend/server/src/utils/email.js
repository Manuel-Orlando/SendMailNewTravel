const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarEmailConfirmacao(destinatario, token) {
  const link = `${process.env.BACKEND_URL}/auth/confirmar-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: "Confirmação de Cadastro",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 1rem;">
        <h2>Confirmação de Cadastro</h2>
        <p>Olá! Clique no botão abaixo para confirmar seu cadastro:</p>
        <a href="${link}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 10px;
        ">Confirmar Email</a>
        <p style="margin-top: 1rem;">Ou copie e cole este link no navegador:</p>
        <p>${link}</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ E-mail enviado:", info.response);
    return { sucesso: true, info };
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
    return { sucesso: false, erro: error.message };
  }
}

module.exports = { enviarEmailConfirmacao };
