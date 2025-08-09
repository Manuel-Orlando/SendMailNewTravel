const cron = require("node-cron");
const Reserva = require("../models/Reserva");

// Função que remove reservas com mais de 24h
async function limparReservasExpiradas() {
  const limite = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    const resultado = await Reserva.deleteMany({
      dataCriacao: { $lt: limite },
    });
    console.log(`🧹 Reservas expiradas removidas: ${resultado.deletedCount}`);
  } catch (error) {
    console.error("Erro ao limpar reservas expiradas:", error.message);
  }
}

// Agendar para rodar a cada hora
cron.schedule("0 * * * *", () => {
  console.log("⏰ Executando limpeza de reservas expiradas...");
  limparReservasExpiradas();
});
