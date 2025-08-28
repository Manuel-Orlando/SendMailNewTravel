import { LuCalendarDays } from "react-icons/lu";
import { MdCardTravel, MdOutlineEmojiFoodBeverage } from "react-icons/md";
import { PiPersonSimpleHikeBold } from "react-icons/pi";
import { FaPersonArrowUpFromLine } from "react-icons/fa6";
import { TbPigMoney } from "react-icons/tb";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import InfoIcon from "../../components/ui/InfoIcon";

export default function ViagemCard({
  image,
  title,
  text,
  data,
  vacancy,
  touristguide,
  breakfast,
  boarding,
  price,
  id,
}) {
  const calcularParcela = () => {
    if (!price || price === "Preço não informado") return "R$ 0,00";

    try {
      const precoNumerico = parseFloat(
        price.toString().replace("R$ ", "").replace(",", ".")
      );

      if (isNaN(precoNumerico)) return "R$ 0,00";

      const valorParcela = (precoNumerico / 12).toFixed(2);
      return `12x de R$ ${valorParcela.replace(".", ",")}`;
    } catch {
      return "R$ 0,00";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-4 m-2 shadow-lg rounded-lg bg-white flex flex-col"
    >
      <img
        className="h-48 w-full rounded-md object-cover mb-4"
        src={image}
        alt={title}
      />

      <div className="flex flex-col flex-grow gap-4">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
          {title}
        </h3>

        {/* Descrição */}
        <div className="flex-grow">
          <p className="text-sm text-gray-700 whitespace-pre-line break-words">
            {text}
          </p>
        </div>

        {/* Grid de informações - PRIMEIRA LINHA */}
        <div className="grid grid-cols-3 gap-3">
          <InfoIcon
            label="Data"
            value={data}
            icon={<LuCalendarDays size={18} />}
          />
          <InfoIcon
            label="Vagas"
            value={`${vacancy} ${vacancy === 1 ? "vaga" : "vagas"}`}
            icon={<MdCardTravel size={18} />}
          />
          <InfoIcon
            label="Embarque"
            value={boarding}
            icon={<FaPersonArrowUpFromLine size={18} />}
          />
        </div>

        {/* Grid de informações - SEGUNDA LINHA */}
        <div className="grid grid-cols-3 gap-3">
          <InfoIcon
            label="Guia"
            value={touristguide}
            icon={<PiPersonSimpleHikeBold size={18} />}
          />
          <InfoIcon
            label="Café"
            value={breakfast}
            icon={<MdOutlineEmojiFoodBeverage size={18} />}
          />
          <InfoIcon
            label="Parcelas"
            value={calcularParcela()}
            icon={<TbPigMoney size={18} />}
          />
        </div>

        {/* Botão */}
        <Link
          to={`/viagens/${id}`}
          className="bg-sky-500 hover:bg-sky-700 rounded-lg px-4 py-3 text-white font-semibold shadow-md transition-colors block text-center w-full mt-2"
        >
          Saiba mais
        </Link>
      </div>
    </motion.div>
  );
}
