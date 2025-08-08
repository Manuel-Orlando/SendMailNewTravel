export default function InfoIcon({ label, value, icon }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-indigo-700">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs">{label}</span>
        <span className="text-xs font-semibold text-black">{value}</span>
      </div>
    </div>
  );
}
