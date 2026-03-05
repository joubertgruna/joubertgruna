# ✅ CHECKLIST - PRÓXIMOS PASSOS

## FASE 1: CONFIGURAÇÃO PRODUÇÃO (4-6 horas)

### 1.1 Configurar Variáveis de Ambiente
```bash
# Frontend: frontend/.env.production
VITE_API_URL=https://seu-dominio.com/api
VITE_SOCKET_URL=https://seu-dominio.com
VITE_APP_TITLE=Escambo
VITE_APP_VERSION=1.0.0
```

```bash
# Backend: backend/.env.production
NODE_ENV=production
PORT=3000
DB_HOST=seu-database-host
DB_PORT=3306
DB_USER=escambo_prod
DB_PASSWORD=<senha-super-segura>
DB_NAME=escambo_prod

JWT_SECRET=<gerar-com-openssl-rand>
JWT_EXPIRY=7d

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<sua-key>
AWS_SECRET_ACCESS_KEY=<sua-secret>
AWS_BUCKET_NAME=escambo-photos-prod

CORS_ORIGIN=https://seu-dominio.com
LOG_LEVEL=info
```

**Comando para gerar JWT_SECRET:**
```bash
openssl rand -base64 32
# Resultado: copia para .env
```

---

### 1.2 Build Otimizado para Produção

```bash
# Frontend production build
cd frontend
npm run build
# Output: dist/ com arquivos otimizados

# Verificar tamanho
ls -lh dist/assets/

# Servir localmente para testar
npm run preview
```

---

### 1.3 Deploy Backend

**Opção A: DigitalOcean Droplet**
```bash
# SSH para seu droplet
ssh root@seu-ip

# Instalar Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar repo
git clone seu-repo
cd EscamboWebApp/backend

# Instalar deps
npm install --production

# Setup database
npm run migrate
npm run seed

# Iniciar com PM2
npm install -g pm2
pm2 start server.js --name "escambo-api"
pm2 save
pm2 startup
```

**Opção B: Heroku**
```bash
heroku create seu-app
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<seu-secret>
git push heroku master
heroku logs --tail
```

**Opção C: Docker**
```bash
# Build
docker build -t escambo-api .

# Run
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=seu-database \
  escambo-api
```

---

### 1.4 Setup Database em Produção

```bash
# MySQL em DigitalOcean
# 1. Criar droplet com MySQL 8.0
# 2. Conectar remotamente (cuidado com firewall)
# 3. Criar database
mysql -u root -p
CREATE DATABASE escambo_prod;
CREATE USER 'escambo_prod'@'%' IDENTIFIED BY 'senha-forte';
GRANT ALL PRIVILEGES ON escambo_prod.* TO 'escambo_prod'@'%';
FLUSH PRIVILEGES;

# 4. Rodar migrations
npm run migrate -- --env production
```

---

### 1.5 SSL/HTTPS com Nginx

```bash
# Instalar Nginx
sudo apt-get install nginx

# Configurar nginx.conf
sudo nano /etc/nginx/sites-available/default
```

**Conteúdo de nginx.conf:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com;
    
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    # Frontend (SPA)
    location / {
        root /var/www/escambo/frontend/dist;
        try_files $uri /index.html;
    }
    
    # API Backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

**Instalar SSL com Let's Encrypt:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d seu-dominio.com
```

---

## FASE 2: TESTES EM PRODUÇÃO (1-2 horas)

### 2.1 Testar Fluxo Completo

```bash
# 1. Login
curl -X POST https://seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"password"}'

# 2. Criar item
curl -X POST https://seu-dominio.com/api/items \
  -H "Authorization: Bearer seu-token" \
  -F "title=Teste" \
  -F "description=Item teste" \
  -F "category=eletrônicos" \
  -F "condition=Seminovo" \
  -F "trade_for=Outro item" \
  -F "photos=@foto.jpg"

# 3. Listar itens
curl https://seu-dominio.com/api/items

# 4. Chat (testar manualmente no navegador)
# Abrir https://seu-dominio.com no navegador
```

### 2.2 Checklist Manual de Teste

```
[ ] Login/Registro funciona
[ ] Criar item com foto
[ ] Foto foi comprimida para WebP
[ ] Listar itens no feed
[ ] Swipe gestures funcionam
[ ] Like/Unlike funciona
[ ] Chat abre e envia mensagens
[ ] Notificações aparecem (toast)
[ ] Offline indicator aparece quando sem internet
[ ] Performance aceitável (< 3s load)
```

---

## FASE 3: APP STORE PREPARATION (2-3 horas)

### 3.1 Assets Necessários

**Ícone da App:**
- [ ] 192x192px (Android)
- [ ] 512x512px (iOS)
- [ ] 1024x1024px (App Store)

**Screenshots (capturadas no emulador/simulador):**
- [ ] 5-8 screenshots principais
- [ ] 1 screenshot por idioma (português + inglês)
- [ ] Mostrar: login, feed, swipe, item detail, chat

**Descrição da App:**
```
Título: Escambo - Troque itens com segurança

Descrição Curta:
Plataforma de troca peer-to-peer. Encontre e troque itens com outras pessoas.

Descrição Completa:
Escambo é uma plataforma de troca de itens. Publique itens que você não usa, 
encontre itens que quer, faça match com outros usuários e combinem a troca.

Recursos:
- 📱 Interface intuitiva e responsiva
- 💖 Sistema de likes para encontrar matches
- 💬 Chat integrado para comunicação
- 🔐 Seguro e confiável
- 📸 Fotos de alta qualidade
- 🌐 Acesso de qualquer lugar

Categorias: 16 categorias de itens
Idioma: Português
```

**Política de Privacidade:**
```
Criar arquivo: backend/docs/PRIVACY_POLICY.md

Conteúdo mínimo:
- [ ] Que dados coletamos
- [ ] Como usamos
- [ ] Como protegemos
- [ ] Direitos do usuário
- [ ] Contato para dúvidas
```

**Termos de Serviço:**
```
Criar arquivo: backend/docs/TERMS_OF_SERVICE.md

Conteúdo mínimo:
- [ ] Condições de uso
- [ ] Responsabilidades
- [ ] Proibições
- [ ] Indenização
- [ ] Rescisão
```

---

### 3.2 Gerar APK/AAB (Android)

```bash
# Instalar Android Studio + SDK

# Adicionar suporte Android ao Vite
npm install @vitejs/plugin-vue-android

# Gerar APK de release
# Usar Android Studio ou:
npx cap open android
# Build > Build Bundle(s) / APK(s)

# Ou com gradle direto:
cd android
./gradlew bundleRelease
# Output: app/release/app-release.aab
```

---

### 3.3 Gerar IPA (iOS)

```bash
# Requer macOS + Xcode

# Instalar dependencies
npm install -g @capacitor/ios

# Gerar projeto iOS
npx cap add ios

# Abrir Xcode
npx cap open ios

# Build > Archive > Upload to App Store
```

---

## FASE 4: SUBMISSÃO APP STORE

### 4.1 Google Play Store

```
1. [ ] Ir para https://play.google.com/console
2. [ ] Criar novo aplicativo
3. [ ] Preencher informações básicas
4. [ ] Upload APK/AAB
5. [ ] Adicionar screenshots
6. [ ] Preencher descrição
7. [ ] Selecionar categorias
8. [ ] Rating (PEGI-3 é seguro)
9. [ ] Privacidade e permissões
10. [ ] Revisar e submeter
11. [ ] Aguardar revisão (2-4 horas)
12. [ ] Publicar
```

### 4.2 Apple App Store

```
1. [ ] Ir para https://appstoreconnect.apple.com
2. [ ] Criar novo app
3. [ ] Preencher informações
4. [ ] Upload IPA
5. [ ] TestFlight (teste com beta users)
6. [ ] Submeter para review
7. [ ] Aguardar revisão (24-48 horas)
8. [ ] Publicar
```

---

## FASE 5: POS-LANCAMENTO

### 5.1 Monitoramento

```bash
# Sentry para error tracking
npm install @sentry/vue @sentry/tracing

# Google Analytics
npm install google-analytics-4

# Logs centralizados
# Setup: Loggly, Papertrail, ou AWS CloudWatch
```

### 5.2 Atualizações

```bash
# Patch bug crítico encontrado
git checkout -b fix/critical-bug
# ... fix ...
npm run build
# Deploy
# Submeter novo build para app store

# Timeframe: 2-4 horas para revisão
```

---

## ESTIMATIVA DE TEMPO

| Fase | Tempo | Status |
|------|-------|--------|
| Fase 1: Config Produção | 4-6h | ⏳ TODO |
| Fase 2: Testes | 1-2h | ⏳ TODO |
| Fase 3: Assets | 2-3h | ⏳ TODO |
| Fase 4: Submit | 1-2h | ⏳ TODO |
| Fase 5: Monitoramento | 1-2h | ⏳ TODO |
| **TOTAL** | **9-15h** | |

---

## COMANDOS RÁPIDOS

```bash
# Build tudo para produção
npm run build  # frontend
npm run build  # backend (se aplicável)

# Testar build localmente
cd frontend && npm run preview

# Deploy (exemplo DigitalOcean)
scp -r dist/ root@seu-ip:/var/www/escambo/frontend/
ssh root@seu-ip "cd /var/www/escambo/backend && npm install --production && npm run migrate && pm2 restart escambo-api"

# Ver logs
pm2 logs escambo-api

# Rollback (se necessário)
git revert seu-commit-hash
npm run build
# Deploy novamente
```

---

## SUPORTE & RECURSOS

- 📖 Documentação: `/docs/`
- 🧪 Testes: `/tests/`
- 📋 Seed dados: `npm run seed`
- 🔍 Logs: `pm2 logs`
- 📊 Métricas: Dashboard da sua infra

---

**Status:** ✅ Pronto para iniciar próximas fases!  
**Próximo passo:** Comece pela Fase 1 (Config Produção)
