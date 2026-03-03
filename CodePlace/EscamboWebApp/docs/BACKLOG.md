# 📋 Backlog do Projeto – Escambo

> Organizado por épicos, com prioridades e estimativas.

## Legenda

| Prioridade | Significado       |
| ---------- | ----------------- |
| 🔴 P0     | Crítico / MVP     |
| 🟠 P1     | Importante        |
| 🟡 P2     | Desejável         |
| 🟢 P3     | Futuro / Nice-to-have |

| Estimativa | Significado       |
| ---------- | ----------------- |
| XS         | < 2 horas         |
| S          | 2–4 horas         |
| M          | 4–8 horas         |
| L          | 1–2 dias          |
| XL         | 2–5 dias          |

---

## 🔐 Épico 1: Autenticação

| #   | Tarefa                                          | Prioridade | Estimativa | Status |
| --- | ----------------------------------------------- | ---------- | ---------- | ------ |
| 1.1 | Criar migration da tabela `users`               | 🔴 P0     | S          | ⬜     |
| 1.2 | Implementar endpoint POST `/api/auth/register`  | 🔴 P0     | M          | ⬜     |
| 1.3 | Implementar endpoint POST `/api/auth/login`     | 🔴 P0     | M          | ⬜     |
| 1.4 | Middleware de autenticação JWT                   | 🔴 P0     | M          | ⬜     |
| 1.5 | Tela de cadastro (frontend)                     | 🔴 P0     | M          | ⬜     |
| 1.6 | Tela de login (frontend)                        | 🔴 P0     | M          | ⬜     |
| 1.7 | Splash screen com animação                      | 🟠 P1     | S          | ⬜     |
| 1.8 | Persistência de token (localStorage)            | 🔴 P0     | XS         | ⬜     |
| 1.9 | Proteção de rotas (Vue Router guard)            | 🔴 P0     | S          | ⬜     |
| 1.10| Testes unitários – auth service                 | 🟠 P1     | M          | ⬜     |
| 1.11| Testes integração – auth routes                 | 🟠 P1     | M          | ⬜     |

---

## 📦 Épico 2: Itens

| #   | Tarefa                                          | Prioridade | Estimativa | Status |
| --- | ----------------------------------------------- | ---------- | ---------- | ------ |
| 2.1 | Criar migration da tabela `items`               | 🔴 P0     | S          | ⬜     |
| 2.2 | Criar migration da tabela `photos`              | 🔴 P0     | S          | ⬜     |
| 2.3 | Implementar CRUD de itens (backend)             | 🔴 P0     | L          | ⬜     |
| 2.4 | Upload de fotos com Multer + S3                 | 🔴 P0     | L          | ⬜     |
| 2.5 | Tela de criação de item (frontend)              | 🔴 P0     | L          | ⬜     |
| 2.6 | Feed de itens em grid (frontend)                | 🔴 P0     | L          | ⬜     |
| 2.7 | Scroll infinito no feed                         | 🟠 P1     | M          | ⬜     |
| 2.8 | Lazy loading de imagens                         | 🟠 P1     | S          | ⬜     |
| 2.9 | Álbum com carousel de fotos                     | 🔴 P0     | M          | ⬜     |
| 2.10| Filtro por categoria                            | 🟡 P2     | M          | ⬜     |
| 2.11| Compressão de imagens antes do upload           | 🟡 P2     | M          | ⬜     |
| 2.12| Testes unitários – items service                | 🟠 P1     | M          | ⬜     |
| 2.13| Testes integração – items routes                | 🟠 P1     | M          | ⬜     |

---

## ❤️ Épico 3: Curtidas e Match

| #   | Tarefa                                          | Prioridade | Estimativa | Status |
| --- | ----------------------------------------------- | ---------- | ---------- | ------ |
| 3.1 | Criar migration da tabela `likes`               | 🔴 P0     | S          | ⬜     |
| 3.2 | Criar migration da tabela `matches`             | 🔴 P0     | S          | ⬜     |
| 3.3 | Implementar endpoint de curtida                 | 🔴 P0     | M          | ⬜     |
| 3.4 | Implementar algoritmo de match                  | 🔴 P0     | L          | ⬜     |
| 3.5 | Swipe com gestos (touch/mouse)                  | 🔴 P0     | L          | ⬜     |
| 3.6 | Animação de swipe (gostei/não gostei)           | 🟠 P1     | M          | ⬜     |
| 3.7 | Tela de "Match!" com animação                   | 🔴 P0     | M          | ⬜     |
| 3.8 | Lista de curtidas recebidas                     | 🟠 P1     | M          | ⬜     |
| 3.9 | Lista de matches                                | 🔴 P0     | M          | ⬜     |
| 3.10| Notificação visual de novo match                | 🟠 P1     | S          | ⬜     |
| 3.11| Testes – like service                           | 🟠 P1     | M          | ⬜     |
| 3.12| Testes – match algorithm                        | 🔴 P0     | M          | ⬜     |

---

## 💬 Épico 4: Chat

| #   | Tarefa                                          | Prioridade | Estimativa | Status |
| --- | ----------------------------------------------- | ---------- | ---------- | ------ |
| 4.1 | Criar migration da tabela `messages`            | 🔴 P0     | S          | ⬜     |
| 4.2 | Configurar Socket.io no backend                 | 🔴 P0     | M          | ⬜     |
| 4.3 | Implementar envio/recebimento de mensagens      | 🔴 P0     | L          | ⬜     |
| 4.4 | Tela de chat (frontend)                         | 🔴 P0     | L          | ⬜     |
| 4.5 | Persistência de mensagens no banco              | 🔴 P0     | M          | ⬜     |
| 4.6 | Indicador de mensagem lida                      | 🟡 P2     | M          | ⬜     |
| 4.7 | Badge de mensagens não lidas                    | 🟠 P1     | S          | ⬜     |
| 4.8 | Testes – chat service                           | 🟠 P1     | M          | ⬜     |

---

## 📢 Épico 5: Anúncios

| #   | Tarefa                                          | Prioridade | Estimativa | Status |
| --- | ----------------------------------------------- | ---------- | ---------- | ------ |
| 5.1 | Criar migration da tabela `ads`                 | 🔴 P0     | S          | ⬜     |
| 5.2 | CRUD de anúncios (backend)                      | 🟠 P1     | M          | ⬜     |
| 5.3 | Endpoint para próximo anúncio                   | 🔴 P0     | S          | ⬜     |
| 5.4 | Tela de exibição de anúncio                     | 🔴 P0     | M          | ⬜     |
| 5.5 | Contador regressivo + botão pular               | 🔴 P0     | S          | ⬜     |
| 5.6 | Registro de impressões e cliques                | 🟠 P1     | S          | ⬜     |
| 5.7 | Testes – ads service                            | 🟠 P1     | S          | ⬜     |

---

## 📱 Épico 6: PWA

| #   | Tarefa                                          | Prioridade | Estimativa | Status |
| --- | ----------------------------------------------- | ---------- | ---------- | ------ |
| 6.1 | Configurar manifest.json                        | 🔴 P0     | S          | ⬜     |
| 6.2 | Configurar Service Worker (Workbox)             | 🔴 P0     | L          | ⬜     |
| 6.3 | Cache estático (app shell)                      | 🔴 P0     | M          | ⬜     |
| 6.4 | Cache dinâmico (API + imagens)                  | 🔴 P0     | M          | ⬜     |
| 6.5 | Estratégia offline-first                        | 🔴 P0     | M          | ⬜     |
| 6.6 | Prompt de instalação (A2HS)                     | 🟠 P1     | S          | ⬜     |
| 6.7 | Indicador de modo offline                       | 🟠 P1     | S          | ⬜     |
| 6.8 | Push notifications                              | 🟢 P3     | XL         | ⬜     |
| 6.9 | Otimização Lighthouse (Performance > 90)        | 🟠 P1     | L          | ⬜     |
| 6.10| Otimização Lighthouse (PWA > 90)                | 🟠 P1     | M          | ⬜     |

---

## ☁️ Épico 7: Infraestrutura (AWS + Terraform)

| #   | Tarefa                                          | Prioridade | Estimativa | Status |
| --- | ----------------------------------------------- | ---------- | ---------- | ------ |
| 7.1 | Configurar provider AWS no Terraform            | 🔴 P0     | XS         | ⬜     |
| 7.2 | Módulo VPC + Subnets                            | 🔴 P0     | M          | ⬜     |
| 7.3 | Módulo Security Groups                          | 🔴 P0     | S          | ⬜     |
| 7.4 | Módulo EC2                                      | 🔴 P0     | M          | ⬜     |
| 7.5 | Módulo RDS MySQL                                | 🔴 P0     | M          | ⬜     |
| 7.6 | Módulo S3 (imagens)                             | 🔴 P0     | S          | ⬜     |
| 7.7 | Módulo CloudFront                               | 🟡 P2     | M          | ⬜     |
| 7.8 | IAM Roles e Policies                            | 🔴 P0     | M          | ⬜     |
| 7.9 | Variáveis por ambiente (dev/prod)               | 🟠 P1     | S          | ⬜     |
| 7.10| Outputs úteis (IPs, endpoints)                  | 🟠 P1     | XS         | ⬜     |

---

## 🔄 Épico 8: CI/CD (GitHub Actions)

| #   | Tarefa                                          | Prioridade | Estimativa | Status |
| --- | ----------------------------------------------- | ---------- | ---------- | ------ |
| 8.1 | Pipeline CI (lint + tests + build)              | 🔴 P0     | M          | ⬜     |
| 8.2 | Pipeline deploy dev                             | 🟠 P1     | L          | ⬜     |
| 8.3 | Pipeline deploy produção                        | 🟠 P1     | L          | ⬜     |
| 8.4 | Branch protection rules                         | 🟠 P1     | XS         | ⬜     |
| 8.5 | Secrets management                              | 🔴 P0     | S          | ⬜     |

---

## 🧪 Épico 9: Testes

| #   | Tarefa                                          | Prioridade | Estimativa | Status |
| --- | ----------------------------------------------- | ---------- | ---------- | ------ |
| 9.1 | Configurar Jest (backend)                       | 🔴 P0     | S          | ⬜     |
| 9.2 | Configurar Supertest (integração)               | 🔴 P0     | S          | ⬜     |
| 9.3 | Configurar Cypress (E2E)                        | 🟠 P1     | M          | ⬜     |
| 9.4 | Testes unitários – services                     | 🔴 P0     | L          | ⬜     |
| 9.5 | Testes unitários – utils                        | 🟠 P1     | M          | ⬜     |
| 9.6 | Testes integração – todas as rotas              | 🔴 P0     | XL         | ⬜     |
| 9.7 | Testes E2E – fluxo completo                     | 🟠 P1     | XL         | ⬜     |
| 9.8 | Configurar cobertura mínima (80%)               | 🟠 P1     | XS         | ⬜     |

---

## 📊 Resumo por Épico

| Épico           | Total de Tarefas | P0 (Crítico) | P1 | P2 | P3 |
| --------------- | ---------------- | ------------- | -- | -- | -- |
| Autenticação    | 11               | 7             | 4  | 0  | 0  |
| Itens           | 13               | 7             | 4  | 2  | 0  |
| Curtidas/Match  | 12               | 7             | 4  | 0  | 1  |
| Chat            | 8                | 5             | 2  | 1  | 0  |
| Anúncios        | 7                | 4             | 3  | 0  | 0  |
| PWA             | 10               | 5             | 4  | 0  | 1  |
| Infraestrutura  | 10               | 7             | 2  | 1  | 0  |
| CI/CD           | 5                | 2             | 3  | 0  | 0  |
| Testes          | 8                | 4             | 3  | 0  | 0  |
| **TOTAL**       | **84**           | **48**        |**29**|**4**|**2**|
