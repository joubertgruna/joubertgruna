# 📘 PLANEJAMENTO COMPLETO DO PROJETO ESCAMBO

> **Documento oficial de requisitos, arquitetura, planejamento e instruções para geração da aplicação.**
> **Versão:** 1.0.0 | **Data:** 24/02/2026 | **Autor:** Joubert Gabriel

---

## 🧩 1. Visão Geral do Projeto

O **Escambo** é uma aplicação **WebApp/PWA** que permite que usuários troquem itens entre si **sem envolver compra ou venda**.

> O foco da plataforma é nos **itens**, não nas pessoas.

### Requisitos de plataforma

| Requisito            | Status     |
| -------------------- | ---------- |
| 100% Responsiva      | ✅ Obrigatório |
| 100% PWA             | ✅ Obrigatório |
| Funcionar offline    | ✅ Obrigatório |
| Cross-browser        | ✅ Obrigatório |
| Leve e otimizada     | ✅ Obrigatório |
| Escalável (+1000 users) | ✅ Obrigatório |

---

## 🎯 2. Objetivo da Aplicação

Facilitar **trocas diretas** entre pessoas, eliminando a necessidade de vender um item para comprar outro.

### Exemplos de trocas

- 🚲 Bicicleta ↔ 🎮 Videogame
- 🚗🚗 Dois carros ↔ 🏠 Casa
- 🚗 Carro ↔ 🏢 Apartamento

### Funcionalidades-chave

1. Publicação de itens
2. Navegação por itens de outros usuários
3. Sistema de curtidas (swipe)
4. Match entre usuários
5. Chat após match
6. Exibição obrigatória de anúncio antes do chat

---

## 🖥️ 3. Frontend – Vue.js 3 + Bootstrap 5 (PWA)

### 3.1. Stack frontend

| Tecnologia        | Versão   | Propósito                  |
| ----------------- | -------- | -------------------------- |
| Vue.js            | 3.x      | Framework SPA reativo      |
| Vue Router        | 4.x      | Roteamento SPA             |
| Pinia             | 2.x      | Gerenciamento de estado    |
| Bootstrap         | 5.x      | UI responsiva              |
| Vite              | 5.x      | Build tool                 |
| Workbox           | 7.x      | Service Worker / PWA       |
| Socket.io-client  | 4.x      | Chat em tempo real         |
| Axios             | 1.x      | Requisições HTTP           |

### 3.2. Fluxo inicial

1. **Splash Screen** → Logo animado do Escambo (2s)
2. **Tela de Cadastro/Login**
   - Nome
   - E-mail
   - Telefone
3. **Pós-cadastro**
   - Envio de fotos dos itens **OU**
   - Pular etapa e ir ao feed

### 3.3. Feed de itens

- Estilo semelhante ao **Instagram**
- Sem cabeçalho de perfil
- Apenas fotos dos itens
- **Foco total nos itens**
- Scroll infinito
- Lazy loading de imagens

### 3.4. Álbum de usuário

- Ampliar foto ao clicar (modal/lightbox)
- **Interações por gestos:**
  - 👉 Swipe direita → **Gostei**
  - 👈 Swipe esquerda → **Não gostei**
- Dono do álbum vê quem gostou de seus itens

### 3.5. Match e Chat

1. **Match** ocorre quando ambos curtirem itens um do outro
2. Antes do chat → Exibir **anúncio patrocinado** (30–60s)
3. Após anúncio → **Chat liberado**

### 3.6. Requisitos PWA

- `manifest.json` completo
- Service Worker com Workbox
- Cache inteligente (estático + dinâmico)
- Estratégia **offline-first**
- Instalação como app nativo
- Lighthouse score > 90

---

## ⚙️ 4. Backend – Node.js + Express + MySQL

### 4.1. Stack backend

| Tecnologia      | Versão | Propósito                    |
| --------------- | ------ | ---------------------------- |
| Node.js         | 20 LTS | Runtime                      |
| Express         | 4.x    | Framework HTTP               |
| MySQL2          | 3.x    | Driver MySQL                 |
| Knex.js         | 3.x    | Query builder + Migrations   |
| JWT             | 9.x    | Autenticação                 |
| Multer          | 1.x    | Upload de arquivos           |
| Socket.io       | 4.x    | WebSocket (chat)             |
| bcryptjs        | 2.x    | Hash de senhas               |
| Joi             | 17.x   | Validação de dados           |
| helmet          | 7.x    | Segurança HTTP               |
| cors            | 2.x    | Cross-Origin                 |
| dotenv          | 16.x   | Variáveis de ambiente        |
| winston         | 3.x    | Logging                      |

### 4.2. Arquitetura – Monolito Modular

> **Justificativa:** Para a fase inicial (MVP), um monolito modular oferece:
> - Menor complexidade operacional
> - Deploy simplificado
> - Desenvolvimento mais rápido
> - Fácil refatoração futura para microserviços

#### Estrutura em camadas

```
backend/
├── src/
│   ├── config/          # Configurações (DB, auth, etc.)
│   ├── controllers/     # Recebem requests, chamam services
│   ├── services/        # Lógica de negócio
│   ├── repositories/    # Acesso a dados (queries)
│   ├── models/          # Definições de entidades
│   ├── middlewares/      # Auth, upload, error handling
│   ├── routes/          # Definição de rotas
│   ├── utils/           # Helpers e utilitários
│   ├── validators/      # Schemas de validação (Joi)
│   ├── sockets/         # Handlers de WebSocket
│   └── app.js           # Setup Express
├── migrations/          # Migrations Knex
├── seeds/               # Seeds opcionais
└── server.js            # Entry point
```

### 4.3. API Endpoints

| Método | Rota                      | Descrição                  |
| ------ | ------------------------- | -------------------------- |
| POST   | `/api/auth/register`      | Cadastro de usuário        |
| POST   | `/api/auth/login`         | Login (JWT)                |
| GET    | `/api/users/me`           | Perfil do usuário logado   |
| PUT    | `/api/users/me`           | Atualizar perfil           |
| POST   | `/api/items`              | Criar item                 |
| GET    | `/api/items`              | Listar itens (feed)        |
| GET    | `/api/items/:id`          | Detalhe de um item         |
| PUT    | `/api/items/:id`          | Atualizar item             |
| DELETE | `/api/items/:id`          | Remover item               |
| POST   | `/api/items/:id/photos`   | Upload de fotos            |
| POST   | `/api/likes`              | Curtir item                |
| DELETE | `/api/likes/:id`          | Descurtir item             |
| GET    | `/api/likes/received`     | Curtidas recebidas         |
| GET    | `/api/matches`            | Listar matches             |
| GET    | `/api/matches/:id`        | Detalhe do match           |
| GET    | `/api/chat/:matchId`      | Mensagens do chat          |
| POST   | `/api/chat/:matchId`      | Enviar mensagem            |
| GET    | `/api/ads/next`           | Próximo anúncio            |

---

## 🗄️ 5. Banco de Dados – MySQL

### 5.1. Entidades

| Entidade   | Descrição                          |
| ---------- | ---------------------------------- |
| `users`    | Usuários da plataforma             |
| `items`    | Itens publicados para troca        |
| `photos`   | Fotos associadas aos itens         |
| `likes`    | Curtidas em itens                  |
| `matches`  | Matches entre dois usuários        |
| `messages` | Mensagens do chat                  |
| `ads`      | Anúncios patrocinados              |

### 5.2. Modelo ER (resumo)

```
users (1) ──── (N) items
items (1) ──── (N) photos
users (1) ──── (N) likes
likes (N) ──── (1) items
matches ──── users (user_1 & user_2)
matches (1) ──── (N) messages
ads (independente)
```

> Modelo ER detalhado em: `docs/MODELO_ER.md`

---

## ☁️ 6. Infraestrutura – Terraform + AWS (IaC)

### 6.1. Recursos AWS

| Recurso          | Propósito                        |
| ---------------- | -------------------------------- |
| VPC              | Rede isolada                     |
| Subnets          | Pública + Privada                |
| Security Groups  | Firewall                         |
| EC2              | Servidor da aplicação            |
| RDS MySQL        | Banco de dados gerenciado        |
| S3               | Armazenamento de imagens         |
| CloudFront       | CDN para assets estáticos        |
| IAM Roles        | Permissões e políticas           |

### 6.2. Estrutura Terraform

```
infra/
├── main.tf
├── variables.tf
├── outputs.tf
├── provider.tf
├── modules/
│   ├── vpc/
│   ├── ec2/
│   ├── rds/
│   ├── s3/
│   ├── cloudfront/
│   └── iam/
└── environments/
    ├── dev.tfvars
    └── prod.tfvars
```

---

## 🔄 7. CI/CD – GitHub Actions

### 7.1. Pipelines

| Pipeline         | Trigger           | Ações                              |
| ---------------- | ----------------- | ---------------------------------- |
| `ci.yml`         | Push/PR em `dev`  | Lint + Testes + Build              |
| `deploy-dev.yml` | Merge em `dev`    | Deploy em ambiente dev             |
| `deploy-prod.yml`| Merge em `main`   | Deploy em produção                 |

### 7.2. Branch Strategy

```
main ← (produção, protegida)
  └── dev ← (desenvolvimento)
        └── feature/* ← (features individuais)
```

> ⚠️ Deploy bloqueado se testes falharem.

---

## 🧪 8. Testes Automatizados

| Tipo        | Ferramenta | Cobertura |
| ----------- | ---------- | --------- |
| Unitários   | Jest       | ≥ 80%     |
| Integração  | Supertest  | ≥ 80%     |
| E2E         | Cypress    | Fluxos principais |

### Estrutura de testes

```
tests/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   ├── routes/
│   └── repositories/
└── e2e/
    └── cypress/
```

---

## 📱 9. PWA – Requisitos Detalhados

### Checklist PWA

- [x] `manifest.json` com nome, ícones, cores, display
- [x] Service Worker registrado
- [x] Cache estático (shell da app)
- [x] Cache dinâmico (API responses)
- [x] Estratégia offline-first
- [x] Suporte a instalação (A2HS)
- [x] Push notifications (opcional/futuro)
- [x] Lighthouse Performance > 90
- [x] Lighthouse PWA > 90

---

## 📚 10. Artefatos de Planejamento

| Artefato                  | Arquivo                          |
| ------------------------- | -------------------------------- |
| Planejamento completo     | `docs/PLANEJAMENTO_ESCAMBO.md`   |
| Diagrama de arquitetura   | `docs/ARQUITETURA.md`            |
| Modelo ER                 | `docs/MODELO_ER.md`              |
| Fluxo de telas            | `docs/FLUXO_TELAS.md`           |
| User Stories              | `docs/USER_STORIES.md`           |
| Backlog                   | `docs/BACKLOG.md`                |
| Estrutura de pastas       | `docs/ESTRUTURA_PASTAS.md`       |

---

## 📦 11. Entregáveis

- [x] Frontend completo (Vue.js 3 + Bootstrap 5 + PWA)
- [x] Backend completo (Node.js + Express + MySQL)
- [x] Infraestrutura Terraform (AWS)
- [x] Pipelines GitHub Actions (CI/CD)
- [x] Testes automatizados (Jest + Supertest + Cypress)
- [x] Documentação completa
- [x] Scripts de build e deploy
- [x] Configuração PWA
- [x] Migrations do banco

---

## 🏁 12. Objetivo Final

Gerar **toda a aplicação Escambo** do início ao fim, incluindo:

- ✅ Código fonte completo
- ✅ Infraestrutura como código
- ✅ Testes automatizados
- ✅ Pipelines de CI/CD
- ✅ Documentação técnica
- ✅ Artefatos de planejamento

> **Tudo de forma coerente, escalável, organizada e pronta para evolução futura.**
