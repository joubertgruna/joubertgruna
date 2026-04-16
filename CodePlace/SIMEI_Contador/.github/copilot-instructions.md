# Copilot Instructions - SIMEI Contador

## 🎯 Visão Geral do Projeto
Sistema de contabilidade para empresas no **Simples Nacional** - PWA com arquitetura MVC.

**Stack Principal:**
- Frontend: Next.js 14 (React) PWA com Tailwind CSS
- Backend: Node.js + Express (padrão MVC)
- Database: MySQL 8 com migrations
- Containers: Docker Compose

## 📁 Estrutura do Projeto
```
/apps/web          # Next.js PWA (porta 3000)
/apps/api          # Express API (porta 3001)
  /controllers     # Handlers de rotas
  /services        # Lógica de negócio
  /models          # Entidades e ORM
  /middlewares     # Auth, validação, errors
  /routes          # Definição de rotas
/infra/docker      # Dockerfiles e configs
/db/migrations     # Scripts SQL de migração
/db/seeds          # Dados de exemplo
```

## 🚀 Comandos Essenciais
```bash
# Desenvolvimento
docker-compose up --build          # Inicia todos os serviços
yarn workspace web dev             # Apenas frontend
yarn workspace api dev             # Apenas backend

# Database
yarn db:migrate                    # Rodar migrations
yarn db:seed                       # Popular dados de teste
```

## 🔐 Autenticação e Roles
- **JWT + Refresh Tokens** - Access token (15min), Refresh (7 dias)
- **Roles:** `empresa`, `admin`, `super_usuario`
- Middleware de auth em `/apps/api/middlewares/auth.js`

## 💼 Regras de Negócio - Simples Nacional
- Anexos I-V com alíquotas progressivas
- Cálculo DAS baseado em faturamento acumulado 12 meses
- Fator R para empresas com folha de pagamento
- **Arquivo:** `/apps/api/services/SimplesNacionalService.js`

## 📊 Endpoints Principais
```
POST /auth/login              # Login JWT
POST /auth/refresh            # Refresh token
POST /empresas                # Criar empresa
GET  /empresas/:id            # Dados da empresa
GET  /empresas/:id/dashboard  # Dashboard financeiro
POST /lancamentos             # Novo lançamento
GET  /relatorios/dre          # Demonstração de resultado
GET  /relatorios/balancete    # Balancete contábil
POST /apuracao/das            # Calcular DAS
```

## 🎨 Convenções de Código

### Backend (Express)
- Controllers apenas orquestram, lógica em Services
- Validação com `express-validator` nos controllers
- Erros padronizados via `ApiError` class
- Transações SQL para operações múltiplas

### Frontend (Next.js)
- App Router (não Pages Router)
- Server Components por padrão, `'use client'` quando necessário
- Hooks customizados em `/hooks`
- API calls via `/lib/api.ts` com axios

### Database
- Nomes de tabelas em `snake_case` (ex: `lancamentos_contabeis`)
- Chaves estrangeiras: `<tabela>_id` (ex: `empresa_id`)
- Soft delete com `deleted_at` timestamp
- Indexes em: `cnpj`, `data`, `empresa_id`

## 🧪 Testes
- Backend: Jest + Supertest em `/apps/api/__tests__`
- Frontend: Jest + React Testing Library
- Foco em testes de serviços fiscais e cálculos

## ⚠️ Atenção Especial
- **Validar CNPJ** antes de salvar (algoritmo de dígitos verificadores)
- **Arredondar valores** monetários para 2 casas decimais
- **Logs de auditoria** para alterações em lançamentos
- **PWA offline** - cache de dados do dashboard

## 🔗 Variáveis de Ambiente
```env
# .env.local (frontend)
NEXT_PUBLIC_API_URL=http://localhost:3001

# .env (backend)
DATABASE_URL=mysql://user:pass@localhost:3306/simei
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```
