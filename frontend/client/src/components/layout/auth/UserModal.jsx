export default function UserModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Informações do Usuário</h2>
        <p>Nome: Usuário Exemplo</p>
        <p>Email: exemplo@email.com</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
