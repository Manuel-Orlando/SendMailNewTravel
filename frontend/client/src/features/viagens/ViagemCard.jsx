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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-block w-full break-inside-avoid p-4 m-2 shadow-lg rounded-lg bg-white"
    >
      <img
        className="h-56 w-full rounded-md object-cover"
        src={image}
        alt={title}
      />
      <div className="flex flex-col mt-3 gap-3">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-gray-700">{text}</p>

        <div className="grid grid-cols-3 gap-3 mt-2">
          <InfoIcon label="Data" value={data} icon={<LuCalendarDays />} />
          <InfoIcon label="Vaga" value={vacancy} icon={<MdCardTravel />} />
          <InfoIcon
            label="Embarque"
            value={boarding}
            icon={<FaPersonArrowUpFromLine />}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-2">
          <InfoIcon
            label="Guia turístico"
            value={touristguide}
            icon={<PiPersonSimpleHikeBold />}
          />
          <InfoIcon
            label="Café da manhã"
            value={breakfast}
            icon={<MdOutlineEmojiFoodBeverage />}
          />
          <InfoIcon label="Preço" value={price} icon={<TbPigMoney />} />
        </div>

        <Link
          to={`/viagem/${id}`}
          className="bg-sky-500 hover:bg-sky-700 rounded-lg px-4 py-2 text-white font-semibold mx-auto mt-4 shadow-md transition-colors block text-center"
        >
          Saiba mais
        </Link>
      </div>
    </motion.div>
  );
}
