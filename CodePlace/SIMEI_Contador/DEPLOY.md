# 🚀 Deploy do SIMEI Contador — Guia Completo

Stack: **Next.js (Vercel)** + **Express API (Render)** + **MySQL (Aiven)**  
Custo: **R$ 0,00** nos planos gratuitos.

---

## Pré-requisitos

- Conta no [GitHub](https://github.com) com o repositório do projeto
- Conta no [Vercel](https://vercel.com) (login com GitHub)
- Conta no [Render](https://render.com) (login com GitHub)
- Conta no [Aiven](https://aiven.io) (login com GitHub)

---

## Passo 1 — Banco de Dados no Aiven

1. Acesse **[console.aiven.io](https://console.aiven.io)**
2. Clique em **"Create service"** → MySQL
3. Selecione:
   - **Cloud:** AWS
   - **Region:** South America (São Paulo) — `aws-sa-east-1`
   - **Plan:** Free (1 GB, sem cobrança)
   - **Service name:** `simei-db`
4. Clique em **"Create free service"** e aguarde ~2 minutos
5. Na aba **"Overview"**, copie a **"Service URI"**:
   ```
   mysql://avnadmin:SENHA@mysql-xxxx.aivencloud.com:PORT/defaultdb?ssl-mode=REQUIRED
   ```
   > 📋 Guarde esse URI — será usado no Render.

---

## Passo 2 — API no Render

1. Acesse **[render.com](https://render.com)** e clique em **"New +"** → **"Web Service"**
2. Conecte o repositório GitHub **joubertgruna/SIMEI_Contador**
3. Configure:
   | Campo | Valor |
   |---|---|
   | **Name** | `simei-api` |
   | **Root Directory** | `apps/api` |
   | **Runtime** | Node |
   | **Build Command** | `npm install && node db/migrate.js` |
   | **Start Command** | `node src/index.js` |
   | **Plan** | Free |

4. Em **"Environment Variables"**, adicione:

   | Chave | Valor |
   |---|---|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | URI copiado do Aiven (Passo 1) |
   | `JWT_SECRET` | *(clique em "Generate")* |
   | `JWT_REFRESH_SECRET` | *(clique em "Generate")* |
   | `GITHUB_TOKEN` | `ghp_seu_token_do_github` |
   | `GITHUB_MODEL` | `gpt-4o-mini` |
   | `ALLOWED_ORIGINS` | *(preencher após Passo 3 — URL do Vercel)* |

5. Clique em **"Create Web Service"**
6. Aguarde o deploy. Anote a URL gerada:
   ```
   https://simei-api.onrender.com
   ```

---

## Passo 3 — Frontend no Vercel

1. Acesse **[vercel.com](https://vercel.com)** e clique em **"Add New..."** → **"Project"**
2. Importe o repositório **joubertgruna/SIMEI_Contador**
3. Configure:
   | Campo | Valor |
   |---|---|
   | **Framework Preset** | Next.js |
   | **Root Directory** | `apps/web` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `.next` |

4. Em **"Environment Variables"**, adicione:

   | Chave | Valor |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | URL do Render (ex: `https://simei-api.onrender.com`) |

5. Clique em **"Deploy"** e aguarde ~2 minutos
6. Anote a URL gerada:
   ```
   https://simei-contador.vercel.app
   ```

---

## Passo 4 — Conectar API ao Frontend (CORS)

1. Volte ao **Render** → seu serviço `simei-api`
2. Vá em **"Environment"** e edite `ALLOWED_ORIGINS`:
   ```
   https://simei-contador.vercel.app
   ```
3. Clique em **"Save Changes"** — o Render fará redeploy automático.

---

## Passo 5 — Verificar

Teste o health check da API:
```
https://simei-api.onrender.com/health
```
Deve retornar:
```json
{ "status": "ok", "timestamp": "..." }
```

Acesse o frontend:
```
https://simei-contador.vercel.app
```

Faça login com:
- **Admin:** `admin@simei.com` / `admin123`
- **Empresa:** `usuario@exemplo.com` / `empresa123`

> ⚠️ **Troque as senhas padrão após o primeiro acesso em produção!**

---

## ⚠️ Limitações do plano gratuito

| Serviço | Limitação |
|---|---|
| **Render (Free)** | API "dorme" após 15min sem requisições. Primeira req após inatividade leva ~30s. |
| **Aiven (Free)** | 1 instância MySQL, 1 GB de armazenamento. |
| **Vercel (Hobby)** | Sem limite de deploys, sem SLA de produção. |

Para remover o "sleep" do Render: upgrade para **Starter ($7/mês)**.

---

## Domínio personalizado (opcional)

- **Vercel:** Settings → Domains → adicione seu domínio
- **Render:** Settings → Custom Domain → adicione o subdomínio da API
- Lembre de atualizar `ALLOWED_ORIGINS` e `NEXT_PUBLIC_API_URL` após mudar os domínios.

---

## Redeploy automático

Qualquer `git push` na branch `master` dispara redeploy automático no Render e Vercel.

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin master
# ✅ Deploy automático em ~2 minutos
```
