📦 Projeto Fullstack — Vite + Express
Este projeto é uma aplicação fullstack com frontend em React (Vite) e backend em Node.js (Express). Ele inclui autenticação, integração com MongoDB, envio de e-mails e está preparado para rodar com Docker.

🗂️ Estrutura do Projeto
meu-projeto/
├── backend/ # Servidor Express
│ ├── src/
│ ├── .env
│ └── ...
├── frontend/ # Aplicação React com Vite
│ ├── src/
│ ├── public/
│ └── ...
├── docker-compose.yml
├── README.md
└── .gitignore

🚀 Como rodar localmente
🔧 Pré-requisitos

- Node.js (v18+ recomendado)
- MongoDB rodando localmente ou em nuvem
- Conta de e-mail (para envio via SMTP)
- PNPM ou Yarn (opcional)

1. Clone o repositório
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd meu-projeto

2. Configure os arquivos .env
   Crie os arquivos .env com base nos exemplos:
   backend/.env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/seu-db
   EMAIL_USER=seu-email@example.com
   EMAIL_PASS=sua-senha

frontend/.env
VITE_API_URL=http://localhost:3000

3. Instale as dependências
   cd backend
   npm install

cd ../frontend
npm install

4. Rode os servidores
   Backend
   npm run dev

Frontend
npm run dev

Acesse o frontend em http://localhost:5173 (ou a porta que o Vite indicar).

🐳 Rodando com Docker

1. Build e up
   docker-compose up --build

Isso irá:

- Construir e subir o backend na porta 3000
- Construir e servir o frontend na porta 5173 (ou conforme configurado)

🧪 Testes
Se você tiver testes configurados, pode rodar:
npm test
