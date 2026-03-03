# 🔄 Escambo – Plataforma de Trocas

> Troque itens diretamente com outras pessoas, sem comprar nem vender.

[![CI](https://github.com/joubertgruna/EscamboWebApp/actions/workflows/ci.yml/badge.svg)](https://github.com/joubertgruna/EscamboWebApp/actions/workflows/ci.yml)

## � Sobre

O **Escambo** é uma aplicação WebApp/PWA que permite que usuários troquem itens entre si sem envolver dinheiro. O foco da plataforma é nos **itens**, não nas pessoas.
A proposta é simples:
## 🛠️ Stack Tecnológica

| Camada          | Tecnologia                    |
| --------------- | ----------------------------- |
| **Frontend**    | Vue.js 3 + Bootstrap 5 + Vite |
| **Backend**     | Node.js + Express             |
| **Banco**       | MySQL (Knex.js)               |
| **Real-time**   | Socket.io                     |
| **Infra**       | AWS (Terraform)               |
| **CI/CD**       | GitHub Actions                |
| **Testes**      | Jest + Supertest + Cypress    |

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+
- MySQL 8+
- npm 10+

### Instalação

```bash
# Clonar repositório
git clone https://github.com/joubertgruna/EscamboWebApp.git
cd EscamboWebApp

# Backend
cd backend
cp .env.example .env
npm install
npm run migrate
npm run dev

# Frontend (em outro terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Com Docker

```bash
docker-compose up -d
```

## 📂 Estrutura do Projeto

```
EscamboWebApp/
├── frontend/          # Vue.js 3 PWA
├── backend/           # Node.js + Express API
├── infra/             # Terraform (AWS)
├── tests/             # Testes (unit, integration, e2e)
├── docs/              # Documentação
└── .github/           # CI/CD workflows
```

## 📚 Documentação

- [Planejamento Completo](docs/PLANEJAMENTO_ESCAMBO.md)
- [Arquitetura](docs/ARQUITETURA.md)
- [Modelo ER](docs/MODELO_ER.md)
- [Fluxo de Telas](docs/FLUXO_TELAS.md)
- [User Stories](docs/USER_STORIES.md)
- [Backlog](docs/BACKLOG.md)
- [Estrutura de Pastas](docs/ESTRUTURA_PASTAS.md)

## 🔑 Funcionalidades

- ✅ Cadastro e autenticação (JWT)
- ✅ Publicação de itens com fotos
- ✅ Feed de itens (estilo Instagram)
- ✅ Sistema de curtidas (swipe)
- ✅ Match automático
- ✅ Chat em tempo real
- ✅ Anúncios antes do chat
- ✅ PWA (offline-first, instalável)

## 🤝 Contribuição

Pull requests são bem-vindos. Siga o padrão de commits e mantenha testes atualizados.

## 📄 Licença

MIT © Joubert Gabriel