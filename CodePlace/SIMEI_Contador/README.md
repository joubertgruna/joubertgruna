# SIMEI Contador

Sistema de contabilidade para empresas no **Simples Nacional** - PWA com arquitetura MVC.

## 🚀 Stack

- **Frontend:** Next.js 14 (React) PWA com Tailwind CSS
- **Backend:** Node.js + Express (padrão MVC)
- **Database:** MySQL 8
- **Containers:** Docker Compose

## 📦 Instalação

### Com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/joubertgruna/simei-contador.git
cd simei-contador

# Copie as variáveis de ambiente
cp .env.example .env

# Inicie os containers
docker-compose up --build
```

Acesse:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **MySQL:** localhost:3306

### Sem Docker (Desenvolvimento local)

```bash
# Instale as dependências
yarn install

# Configure o MySQL e atualize o .env com as credenciais

# Execute as migrations
yarn db:migrate

# Popule com dados de exemplo
yarn db:seed

# Inicie em desenvolvimento
yarn dev:api   # Terminal 1 - API
yarn dev:web   # Terminal 2 - Frontend
```

## 🔑 Credenciais de Demo

```
Email: admin@simei.com
Senha: admin123
```

## 📁 Estrutura do Projeto

```
/apps
  /web           # Next.js PWA (porta 3000)
  /api           # Express API (porta 3001)
    /controllers # Handlers de rotas
    /services    # Lógica de negócio
    /models      # Entidades
    /middlewares # Auth, validação
    /routes      # Rotas da API
/db
  /migrations    # Scripts SQL
  /seeds         # Dados de exemplo
/infra
  /docker        # Dockerfiles
```

## 📊 Funcionalidades MVP

- ✅ Autenticação JWT + Refresh Tokens
- ✅ CRUD de Empresas
- ✅ Lançamentos contábeis
- ✅ Dashboard financeiro
- ✅ Cálculo automático do DAS (Simples Nacional)
- ✅ Relatórios: DRE, Balancete, Fluxo de Caixa
- ✅ PWA offline

## 🔗 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token |
| POST | `/empresas` | Criar empresa |
| GET | `/empresas/:id/dashboard` | Dashboard financeiro |
| POST | `/lancamentos` | Novo lançamento |
| GET | `/relatorios/dre` | DRE |
| POST | `/apuracao/das` | Calcular DAS |

## 📜 Licença

MIT
