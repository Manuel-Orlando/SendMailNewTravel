const mongoose = require("mongoose");
const Viagem = require("../models/Viagem");

const viagens = [
  {
    imagem: "https://www.travelclass.tur.br/uploads/2020/08/1-1275x850.jpg",
    titulo: "Recife - PE",
    descricao: "Mergulhe na energia contagiante de Recife! ...",
    data: "22 - 28 Ago",
    vagasTotais: 12,
    vagasDisponiveis: 12,
    guiaTuristico: "Incluso",
    cafeDaManha: "Incluso",
    localEmbarque: "Goiana - PE",
    preco: "12x R$ 150,00",
  },
  {
    imagem:
      "https://i0.wp.com/www.destinosimperdiveis.com.br/wp-content/uploads/2022/09/ponta_verde_marco_dos_corais.jpg?resize=1024%2C683&ssl=1",
    titulo: "Maceió - AL",
    descricao: "Maceió encanta com suas águas cristalinas...",
    data: "22 - 28 Ago",
    vagasTotais: 12,
    vagasDisponiveis: 12,
    guiaTuristico: "Incluso",
    cafeDaManha: "Incluso",
    localEmbarque: "Goiana - PE",
    preco: "12x R$ 199,00",
  },
  // Adicione os demais aqui...
];

mongoose
  .connect("mongodb://localhost:27017/bancodedados", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    await Viagem.deleteMany({});
    await Viagem.insertMany(viagens);
    console.log("Viagens inseridas com sucesso!");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });
