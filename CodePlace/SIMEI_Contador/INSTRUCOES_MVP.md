Resumo: Arquitetura em camadas (MVC) pronta para MVP com Next.js (React) PWA, Node.js (API), MySQL e Docker Compose; abaixo está a especificação técnica, lista de funcionalidades (perfil da empresa, dashboard administrativo e dashboard super‑usuário) e o arquivo INSTRUCOES_MVP.md pronto para adicionar ao seu IDE. Configurações e boas práticas seguem padrões modernos de MVC, containerização e PWA. 

Arquitetura proposta
Visão geral

Camadas: Presentation (Next.js PWA), Application/Controller (Node.js Express), Domain/Service (lógica de negócio), Data Access (MySQL + ORM), Infra (Docker, Redis opcional). 

Diagrama lógico
Frontend (Next.js PWA) ↔ API REST (Node.js/Express) ↔ MySQL

Autenticação: JWT + refresh tokens; roles: empresa, admin, super‑usuário.

Tech stack e motivos
Componente	Escolha	Motivo
Frontend	Next.js (React)	SSR/SSG, PWA, performance.
Backend	Node.js + Express (MVC)	Separação clara Controller/Service/Model.
DB	MySQL	Relacional, compatível com contabilidade.
Containers	Docker Compose	Desenvolvimento e deploy consistentes.
Funcionalidades essenciais (MVP)
Perfil da empresa

Cadastro/edição de dados fiscais (CNPJ, regime, CNAE), endereço, contatos.

Documentos: upload de contrato social, certidões.

Configuração fiscal: alíquotas, anexos do Simples Nacional.

Dashboard administrativo da empresa

Visão financeira: receitas, despesas, fluxo de caixa, gráficos mensais.

Apuração do Simples Nacional: cálculo automático por anexos, guias (DAS) simuladas.

Lançamentos contábeis: criar/editar lançamentos; integração com importação CSV.

Relatórios: balancete, DRE simplificado, demonstrativos por período.

Alertas fiscais: vencimentos, obrigações acessórias.

Dashboard super‑usuário

Gerenciamento de clientes (empresas), planos, permissões.

Criação/gerenciamento de usuários e roles.

Logs e auditoria; backup/restore do banco.

Configurações globais: parâmetros fiscais, templates de e‑mail.

Banco de dados (tabelas principais)
Empresas; Usuarios; Roles; Lancamentos; Guias; Planos; Documentos; Logs.  
Sugestão: normalizar por empresa_id e usar índices em CNPJ, data, tipo.

Docker + PWA — pontos chave
Docker Compose com serviços: web (Next.js), api (Node), db (mysql:8), proxy (nginx opcional). 

Next.config.js: manifest.json, service worker, workbox para offline.

Build: multi‑stage Dockerfiles para reduzir imagem.

Checklist MVP (prioridade)
Autenticação e roles.

CRUD Empresa + Perfil.

Lançamentos e apuração Simples.

Dashboard financeiro básico.

Docker Compose + scripts de seed.

PWA offline básico.

Arquivo INSTRUCOES_MVP.md
markdown
# Instruções para criar MVP - Contabilidade Simples Nacional

## Objetivo
Criar um aplicativo PWA minimalista e sofisticado para contabilidade de empresas no Simples Nacional.

## Stack
- Frontend: Next.js (React) PWA
- Backend: Node.js + Express (MVC)
- DB: MySQL
- Containers: Docker Compose

## Estrutura de pastas sugerida
- /apps/web (Next.js)
- /apps/api (Node.js - controllers, services, models)
- /infra/docker
- /db/migrations
- /docs

## Comandos iniciais
- `docker-compose up --build`
- `yarn workspace web dev`
- `yarn workspace api dev`

## Endpoints essenciais
- `POST /auth/login`
- `POST /empresas`
- `GET /empresas/:id/dashboard`
- `POST /lancamentos`
- `GET /relatorios/dre`

## Checklist de entrega MVP
- Autenticação, CRUD empresa, lançamentos, apuração Simples, dashboard, Docker, PWA manifest.

## Observações
Implemente testes unitários para serviços fiscais e scripts de seed para dados de exemplo.
Se quiser, eu posso gerar o