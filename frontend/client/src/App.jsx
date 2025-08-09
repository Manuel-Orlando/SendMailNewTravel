import Header from "./components/layout/Header";
import ViagensPage from "./features/viagens/ViagensPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ViagensPage />
    </div>
  );
}
