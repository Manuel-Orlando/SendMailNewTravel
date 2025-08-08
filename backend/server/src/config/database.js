const mongoose = require("mongoose");
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/bancodedados";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado ao MongoDB");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
  }
};
console.log("🔗 URI usada:", process.env.MONGO_URI);
module.exports = connectDB;
// backend/server/src/index.js
