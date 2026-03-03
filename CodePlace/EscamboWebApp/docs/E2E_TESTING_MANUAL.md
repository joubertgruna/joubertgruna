# 🧪 E2E TESTING MANUAL - CHECKLIST COMPLETO

**Data:** 3 de março de 2026  
**Tester:** AI Agent + User  
**Objetivo:** Descobrir bugs reais antes de "lançar"  
**Ambiente:** http://localhost:5173 (Frontend) + http://localhost:3000 (Backend)

---

## 📋 FLUXO TESTE 1: REGISTRAR & LOGIN

### Pré-requisitos
- [ ] Backend rodando (`npm start` em `/backend`)
- [ ] Frontend rodando (`npm run dev` em `/frontend`)
- [ ] Database MySQL conectado
- [ ] Network tab aberta para ver requisições

### Teste 1.1: Registrar novo usuário
```
ROTA: http://localhost:5173/register
```
- [ ] Página carrega sem erros
- [ ] Campo email vazio → botão desabilitado
- [ ] Campo senha vazio → botão desabilitado
- [ ] Email inválido (ex: `test`) → erro visual ou desabilitado
- [ ] Senha muito curta → erro visual (validação)
- [ ] Preencher corretamente:
  - Email: `teste_swipe_001@email.com` (variar o número)
  - Senha: `Test@123456`
  - Nome: `Teste Swipe`
  - Confirmar senha igual
- [ ] Clicar "Cadastrar"
- [ ] ✅ Sucesso? Redireciona para `/feed`
- [ ] ❌ Erro? Documentar mensagem exata

**Esperado:** Usuário criado no banco, JWT salvo em localStorage

---

### Teste 1.2: Login
```
ROTA: http://localhost:5173/login
```
- [ ] Página carrega
- [ ] Tentar email errado → erro
- [ ] Tentar senha errada → erro
- [ ] Usar credenciais de cadastro anterior
- [ ] ✅ Sucesso? Redireciona para `/feed`
- [ ] Token JWT aparece em localStorage? (`F12 → Application → LocalStorage`)

**Esperado:** Acesso ao feed com token válido

---

## 📸 FLUXO TESTE 2: CRIAR ITEM COM FOTOS

### Teste 2.1: Ir para criar item
```
ROTA: http://localhost:5173/items/new
```
- [ ] Página carrega (abas Bottom Navigation deve ter ➕ ou botão criar)
- [ ] Ou navegar via AppTabBar (aba Create)
- [ ] Página de criação abre

### Teste 2.2: Preencher formulário
```
Campos esperados:
- Title (string)
- Description (textarea)
- Category (select)
- Condition (radio buttons: Novo/Seminovo/Usado/Desgastado)
- Trade For (input ou select)
- Photos (file upload, máx 5)
```

- [ ] **Title:** Preencher `"Notebook Gamer LG"` ou similar
- [ ] **Description:** `"Notebook em perfeito estado, 2 anos de uso"` (min 20 chars)
- [ ] **Category:** Selecionar `"Eletrônicos"`
- [ ] **Condition:** Selecionar `"Seminovo"`
- [ ] **Trade For:** Preencher com categorias que quer trocar (ex: `"Roupas, Livros"`)
- [ ] **Photos:** Upload múltiplo
  - [ ] Tentar upload de imagem inválida (ex: `.txt`) → erro
  - [ ] Fazer upload de 2-3 imagens PNG/JPG válidas
  - [ ] ✅ Imagens aparecem na preview?
  - [ ] [ ] Consegue deletar uma foto? (botão X)
  - [ ] [ ] Upload de 5+ fotos → erro ou limit atingido?

### Teste 2.3: Submeter formulário
- [ ] Clicar "Criar Item"
- [ ] ✅ Sucesso? Mensagem de sucesso e redireciona
- [ ] Verificar no Network tab:
  - [ ] POST `/api/items` com status 201
  - [ ] POST `/api/items/{id}/photos` com upload das imagens
- [ ] ❌ Erro? Documentar resposta exata

**Esperado:** Item criado com ID e fotos uploadadas para `/uploads`

---

## 🎨 FLUXO TESTE 3: FEED & SWIPE GESTURES

### Teste 3.1: Acessar Feed
```
ROTA: http://localhost:5173/feed
```
- [ ] Página carrega com items em grid (2 colunas mobile)
- [ ] Items são do banco de dados (não hardcoded)
- [ ] Imagens dos items aparecem corretamente
- [ ] Badge de categoria visível (top-left)
- [ ] Título do item visível

### Teste 3.2: Filtro de Categoria
- [ ] Botões de categoria no topo (Todos, Eletrônicos, Roupas, etc)
- [ ] Clicar `"Eletrônicos"`
  - [ ] ✅ Feed atualiza mostrando só eletrônicos?
  - [ ] [ ] Botão ativo (cor diferente)?
- [ ] Clicar `"Todos"`
  - [ ] Feed volta a mostrar tudo
- [ ] Clicar `"Roupas"`
  - [ ] [ ] Sem itens? Mostra "Nenhum item disponível"

**Esperado:** Filtro funciona, pode selecionar categorias

---

### Teste 3.3: SWIPE GESTURES (NOVO!)
```
Ativar Device Toggle: Cmd+Shift+M
Escolher: iPhone 12 ou similar
```

- [ ] **Swipe Direita (LIKE ♥)**
  - [ ] Fazer swipe direita em um item (arrastar 100px+)
  - [ ] ✅ Aparece coração verde (♥)?
  - [ ] ✅ Item desaparece após swipe?
  - [ ] ✅ Network tab mostra POST `/api/likes`?
  - [ ] [ ] Próximo item sobe para tomar lugar?

- [ ] **Swipe Esquerda (UNLIKE ✗)**
  - [ ] Swipe esquerda em outro item
  - [ ] ✅ Aparece X vermelho (✗)?
  - [ ] ✅ Item desaparece?
  - [ ] ✅ Network tab mostra DELETE `/api/likes`?

- [ ] **Click Normal (IR PARA DETALHE)**
  - [ ] Click rápido no item (sem swipe)
  - [ ] ✅ Abre página de detalhe (`/items/{id}`)?

**Esperado:** Swipes funcionam, clicks vão para detalhe, API chamadas feitas

---

## ❤️ FLUXO TESTE 4: MATCH & NOTIFICAÇÃO

### Teste 4.1: Verificar Match
```
Pré-requisito: Já fez login com "Teste Swipe"
```

- [ ] Clicar em 💜 Matches na abas
- [ ] ROTA: `http://localhost:5173/matches`
- [ ] Se não tiver matches: mostra "Nenhum match" (ok)
- [ ] Se tiver matches: lista com usuários e último chat

### Teste 4.2: Criar Match (Alternativo)
```
Se não tiver matches automáticos, precisa de 2 usuários:
1. Usuário A: fazer like em item de B
2. Usuário B: fazer like em item de A
3. Sistema detecta like mútuo e cria match
```

- [ ] Registrar outro usuário: `teste_swipe_002@email.com`
- [ ] Usuário B cria um item com foto
- [ ] Login como Usuário A
- [ ] Swipe direita no item de B → like
- [ ] Login como Usuário B
- [ ] Swipe direita no item de A → like
- [ ] ✅ Sistema cria Match automaticamente?
- [ ] Ir para `/matches`
- [ ] ✅ Match aparece na lista?

**Esperado:** Like mútuo cria match automático

---

## 💬 FLUXO TESTE 5: CHAT & MATCH

### Teste 5.1: Abrir Chat
```
Pré-requisito: Ter pelo menos 1 match
ROTA: http://localhost:5173/match/{matchId}/chat
```

- [ ] Clicar no match
- [ ] ✅ Chat view abre?
- [ ] ✅ Nome do usuário aparece (header)?
- [ ] Histórico de mensagens anterior? (se houver)
- [ ] Input field para mensagem

### Teste 5.2: Requisitar Anúncio
```
Antes de chat, precisa de anúncio (regra de negócio)
```

- [ ] Verificar se há botão "Solicitar Anúncio" ou similar
- [ ] Se aparecer: clicar
- [ ] ✅ Anúncio criado?
- [ ] ✅ Chat fica desbloqueado?

### Teste 5.3: Enviar Mensagem
- [ ] Digitar mensagem: `"Opa, posso pegar uma foto melhor?"`
- [ ] Clicar Send (ou Enter)
- [ ] ✅ Mensagem aparece no chat?
- [ ] ✅ Network tab: POST `/api/messages` com status 201?
- [ ] ✅ Mensagem tem timestamp?

### Teste 5.4: Receber Mensagem (Socket.io)
```
Precisa de 2 abas abertas (2 usuários)
```

- [ ] Usuário A e B ambos em chat
- [ ] Usuário A envia mensagem
- [ ] ✅ Usuário B vê em tempo real? (sem refresh)
- [ ] ✅ Sem delay ou erro de socket?

**Esperado:** Chat funciona bidirecionalmente com Socket.io

---

## 👤 FLUXO TESTE 6: PERFIL & AVATAR

### Teste 6.1: Editar Perfil
```
ROTA: http://localhost:5173/profile ou /edit-profile
```

- [ ] Ir para abas (aba 👤 Profile)
- [ ] Clicar em "Editar" ou botão similar
- [ ] ROTA: `/edit-profile`
- [ ] ✅ Formulário abre?

### Teste 6.2: Upload Avatar
- [ ] Clicar em campo de avatar (foto atual ou placeholder)
- [ ] Upload uma imagem JPG/PNG
- [ ] ✅ Imagem preview atualiza?
- [ ] ✅ Clicar "Salvar"
- [ ] ✅ Network tab: POST `/api/users/avatar` com multipart?
- [ ] ✅ Imagem armazenada em `/uploads` no backend?

### Teste 6.3: Atualizar Dados
- [ ] Alterar nome: `"Teste Swipe Editado"`
- [ ] Alterar bio: `"Amo trocar coisas!"`
- [ ] Alterar cidade: `"Belo Horizonte"`
- [ ] Alterar estado: `"MG"`
- [ ] Clicar "Salvar"
- [ ] ✅ Dados atualizam no banco?
- [ ] ✅ Ir para outro lugar e voltar, dados persistem?

**Esperado:** Avatar upload funciona, dados persistem

---

## 📦 FLUXO TESTE 7: MEUS ITENS

### Teste 7.1: Ver Meus Itens
```
ROTA: http://localhost:5173/my-items
```

- [ ] Ir para abas (aba 📦 Meus Itens)
- [ ] ✅ Carrega lista de items criados por você?
- [ ] ✅ Mostra items recentes em cima?
- [ ] ✅ Imagens aparecem corretamente?

### Teste 7.2: Editar Item
- [ ] Clicar em item
- [ ] ✅ ItemDetail abre (`/items/{id}`)?
- [ ] Clicar botão ✏️ Editar (ou similar)
- [ ] ROTA: `/items/{id}/edit`
- [ ] Alterar título: `"Notebook - EDITADO"`
- [ ] Clicar "Salvar"
- [ ] ✅ Atualiza?
- [ ] Ir para `/my-items` novamente
- [ ] ✅ Item reflete mudança?

### Teste 7.3: Deletar Item
- [ ] Ir para `/my-items`
- [ ] Clicar botão 🗑️ Deletar em um item
- [ ] ✅ Confirmação popup? (Are you sure?)
- [ ] Confirmar
- [ ] ✅ Item desaparece da lista?
- [ ] ✅ Network: DELETE `/api/items/{id}` status 204 ou 200?

**Esperado:** CRUD completo para items do usuário

---

## 🔍 FLUXO TESTE 8: DETALHE DO ITEM

### Teste 8.1: Abrir Detalhe
```
ROTA: http://localhost:5173/items/{id}
```

- [ ] Clicar em item no feed
- [ ] ✅ ItemDetailView abre?
- [ ] ✅ Foto principal grande?
- [ ] ✅ Título, descrição, categoria visível?
- [ ] ✅ Info do dono (avatar, nome, cidade)?
- [ ] ✅ Botão para conversar/match?

### Teste 8.2: Galeria de Fotos
- [ ] Se tiver múltiplas fotos
- [ ] ✅ Aparecem em grid/carrossel?
- [ ] Clicar foto → abre Lightbox? (Próxima feature)
- [ ] Pode navegar entre fotos?

### Teste 8.3: Like do Detalhe
- [ ] Botão ♡ (coração) para like
- [ ] Clicar → ♥ fica preenchido?
- [ ] ✅ Network: POST `/api/likes`?
- [ ] Clicar novamente → desfaz like?

**Esperado:** Detalhe completo com todas as infos

---

## 🌐 FLUXO TESTE 9: OFFLINE BEHAVIOR (PWA)

### Teste 9.1: Service Worker
```
DevTools → Application → Service Workers
```

- [ ] SW registrado? (deve mostrar ativo)
- [ ] Cache: Workbox cache as 39 entries?

### Teste 9.2: Offline
```
DevTools → Network → Throttling → Offline
```

- [ ] Desconectar (modo offline)
- [ ] ✅ OfflineIndicator aparece? (badge/banner)
- [ ] Tentar fazer requisição
- [ ] ✅ Erro tratado gracefully?
- [ ] Reconectar
- [ ] ✅ Badge desaparece?

**Esperado:** App mostrar status offline visualmente

---

## 🐛 FLUXO TESTE 10: ERROR HANDLING

### Teste 10.1: Erros de Validação
- [ ] Criar item sem preencher campos obrigatórios
- [ ] ✅ Aparecem erros em vermelho?
- [ ] ✅ Mensagens claras em português?

### Teste 10.2: Erros de API
```
DevTools → Network → Right-click endpoint → Block
```

- [ ] Bloquear `/api/items`
- [ ] Tentar criar item
- [ ] ✅ Erro amigável aparece? (não é 500)
- [ ] ✅ Opção de tentar novamente?

### Teste 10.3: Erros de Upload
- [ ] Tentar upload de arquivo muito grande (>5MB)
- [ ] ✅ Erro na validação do frontend?
- [ ] ✅ Mensagem clara?

**Esperado:** Erros tratados, não quebra a app

---

## 📊 RESUMO DOS TESTES

Após completar todos os testes acima, preencha:

```
TOTAL DE TESTES: 50+
PASSANDO: [ ] / 50
FALHANDO: [ ] / 50
PARCIALMENTE: [ ] / 50

Taxa de sucesso: ___%
```

---

## 🐛 BUGS ENCONTRADOS

### Bug #1
```
Titulo: [Seu bug]
Severidade: [ ] Critical [ ] High [ ] Medium [ ] Low
Reproduzir:
1.
2.
3.
Esperado:
Atual:
Evidência: Screenshot/Network tab/Console error
```

### Bug #2
[Repetir conforme encontre]

---

## ✅ LISTA FINAL

- [ ] Todos os 50+ testes executados
- [ ] Menos de 3 bugs críticos
- [ ] App sem console errors
- [ ] Funciona mobile (touch)
- [ ] Funciona desktop (mouse)
- [ ] Offline indicator visual
- [ ] Swipe gestures OK
- [ ] Chat funciona
- [ ] Matches criados
- [ ] Fotos aparecem

---

**DATA CONCLUSÃO:** ________  
**TESTER:** ________  
**RESULTADO FINAL:** [ ] PRONTO PARA BETA [ ] AINDA PRECISA FIXES

---
