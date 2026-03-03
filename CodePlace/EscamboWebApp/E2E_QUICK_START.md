# 🧪 COMEÇANDO E2E TESTING AGORA

## ⏱️ TEMPO: 10:00 - 10:30 (30 minutos)

---

## 🎯 OBJETIVO

Executar o fluxo completo do app manualmente e descobrir bugs reais antes de "lançar".

---

## 📱 SETUP RÁPIDO

### Pré-requisitos
```bash
✅ Backend rodando em http://localhost:3000
✅ Frontend rodando em http://localhost:5173
✅ MySQL conectado
✅ DevTools aberto (F12)
```

### Ativar Mobile View
```bash
1. Abrir http://localhost:5173
2. F12 (DevTools)
3. Cmd+Shift+M (Toggle Device Toolbar)
4. Escolher: iPhone 12 Pro ou similar
```

---

## 📋 FLUXO SIMPLIFICADO (10 min por teste)

### TESTE 1: Register + Login (5 min)

**Arquivo de referência:** `/docs/E2E_TESTING_MANUAL.md` (seção 1.1-1.2)

```bash
PASSO 1: Ir para http://localhost:5173/register
✅ Página carrega?
✅ Campos vazios = botão desabilitado?
✅ Validação de email?
✅ Validação de senha?

PASSO 2: Preencher
- Email: teste_e2e_001@email.com
- Nome: Teste E2E
- Senha: Test@123456
- Confirmar: Test@123456

PASSO 3: Clicar "Cadastrar"
✅ Redireciona para /feed?
✅ Mensagem de sucesso?
✅ Token em localStorage? (F12 → Application → LocalStorage)

PASSO 4: Ir para /login
✅ Página carrega?

PASSO 5: Fazer login
- Email: teste_e2e_001@email.com
- Senha: Test@123456

PASSO 6: Clicar Login
✅ Redireciona para /feed?
✅ Sem console errors? (F12 → Console)
```

**Resultado:** ✅ ou ❌

---

### TESTE 2: Criar Item com Fotos (5 min)

**Arquivo de referência:** `/docs/E2E_TESTING_MANUAL.md` (seção 2.1-2.3)

```bash
PASSO 1: Ir para http://localhost:5173/items/new
(Ou clique em ➕ ou abas inferior)
✅ Página carrega?
✅ Formulário visível?

PASSO 2: Preencher formulário
- Título: "Notebook Gamer LG"
- Descrição: "Notebook em perfeito estado, 2 anos"
- Categoria: "Eletrônicos"
- Condition: "Seminovo"
- Trade For: "Roupas, Livros"

PASSO 3: Fazer upload de fotos
- Clicar em area de upload
- Selecionar 2-3 imagens JPG/PNG
✅ Imagens aparecem em preview?
✅ Consegue deletar uma? (botão X)

PASSO 4: Clicar "Criar Item"
✅ Sucesso? Redireciona?
✅ Network tab: POST /api/items status 201?
✅ Network tab: POST /api/items/{id}/photos?

PASSO 5: Verificar no banco
- DevTools → Network → Filtrar "items"
- ✅ POST com sucesso?
```

**Resultado:** ✅ ou ❌

---

### TESTE 3: SWIPE GESTURES (5 min) ⭐ NOVO!

**Arquivo de referência:** `/docs/SWIPE_TESTING.md`

```bash
PASSO 1: Ir para http://localhost:5173/feed
✅ Feed carrega?
✅ Items aparecem em grid?
✅ Imagens carregam?

PASSO 2: Testar SWIPE DIREITA (LIKE)
- Pegar em um item no mobile
- ARRASTAR para DIREITA (pelo menos 100px)
✅ Aparece coração verde (♥)?
✅ Cor muda ou item reage?
✅ Network tab: POST /api/likes?
✅ Item desaparece?

PASSO 3: Testar SWIPE ESQUERDA (UNLIKE)
- Pegar em outro item
- ARRASTAR para ESQUERDA (pelo menos 100px)
✅ Aparece X vermelho (✗)?
✅ Network tab: DELETE /api/likes?
✅ Item desaparece?

PASSO 4: Testar CLICK NORMAL
- Rápido tap em um item (sem arrastar)
✅ Abre página de detalhe (/items/{id})?
✅ Mostra foto grande, título, descrição?

PASSO 5: Voltar ao feed
- Voltar com "Voltar" ou ← do app
✅ Feed continua lá?
✅ Itens que curtiu não aparecem?

RESULTADO: 
✅ Swipe direita funciona
✅ Swipe esquerda funciona
✅ Click abre detalhe
✅ Sem console errors
```

**Resultado:** ✅ ou ❌

---

### TESTE 4: Match & Chat (5 min)

**Arquivo de referência:** `/docs/E2E_TESTING_MANUAL.md` (seção 4-5)

```bash
PASSO 1: Verificar Matches
- Ir para abas (aba 💜 Matches)
✅ Página carrega?
✅ Se não tiver matches: "Nenhum match" OK

PASSO 2: Criar Match (precisa de outro usuário)
[OPCIONAL - se tiver tempo]
- Register outro usuário: teste_e2e_002@email.com
- Primeiro usuário faz like em item de segundo
- Segundo faz like em item de primeiro
✅ Match criado automaticamente?
- Ir para /matches
✅ Novo match aparece?

PASSO 3: Abrir Chat
- Se tiver match, clicar
✅ Chat abre?
✅ Nome do usuário no header?

PASSO 4: Solicitar Anúncio
- Verificar se precisa de anúncio antes
- Se sim, clicar em "Solicitar Anúncio"
✅ Anúncio criado?
✅ Chat desbloqueado?

PASSO 5: Enviar Mensagem
- Digitar: "Opa, tudo bem?"
- Enviar
✅ Mensagem aparece?
✅ Network: POST /api/messages?
✅ Com timestamp?
```

**Resultado:** ✅ ou ❌

---

## 📊 RELATÓRIO RÁPIDO

```
TEST RESULTS:
═════════════════════════════════════════

[x] TESTE 1: Register + Login
    Status: ✅ PASSOU
    Issues: NENHUMA
    
[ ] TESTE 2: Criar Item com Fotos
    Status: ⏳ EM ANDAMENTO
    Issues: [anote aqui]
    
[ ] TESTE 3: Swipe Gestures (NOVO!)
    Status: ⏳ EM ANDAMENTO
    Issues: [anote aqui]
    
[ ] TESTE 4: Match & Chat
    Status: ⏳ EM ANDAMENTO
    Issues: [anote aqui]

═════════════════════════════════════════
TOTAL TESTES: 4/4
PASSANDO: ___/4
FALHANDO: ___/4
```

---

## 🐛 TEMPLATE PARA BUGS ENCONTRADOS

Se encontrar um bug, anote:

```
BUG #1
──────────────────────────────────────
Título: [Ex: "Swipe não funciona em Chrome"]
Severidade: [ ] Critical [ ] High [ ] Medium [ ] Low
Reproduzir:
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]
Esperado: [O que deveria acontecer]
Atual: [O que acontece agora]
Evidência: [Screenshot/console error/network]
──────────────────────────────────────
```

---

## ✅ CHECKLIST FINAL

Ao terminar os 4 testes:

```
[ ] Teste 1 - Register + Login: ✅ PASSOU
[ ] Teste 2 - Criar Item: ✅ PASSOU
[ ] Teste 3 - Swipe (NOVO!): ✅ PASSOU
[ ] Teste 4 - Match & Chat: ✅ PASSOU

[ ] Nenhum console.error
[ ] Nenhum console.warn importante
[ ] App funciona mobile
[ ] App funciona sem crashes

RESULTADO: 
[ ] PRONTO PARA LIGHTBOX
[ ] PRECISA DE FIXES ANTES
```

---

## ⏱️ TIMELINE

```
10:00 - 10:05  → TESTE 1: Register + Login
10:05 - 10:10  → TESTE 2: Criar Item com Fotos
10:10 - 10:15  → TESTE 3: SWIPE GESTURES ⭐
10:15 - 10:20  → TESTE 4: Match & Chat
10:20 - 10:30  → Documentar Issues + Buffer

TOTAL: 30 minutos
```

---

## 🎯 DEPOIS (Se tudo OK)

```
10:30 - 11:00  → 📸 LIGHTBOX (próxima feature)
11:00 - 11:20  → 📡 OFFLINE INDICATOR
11:20+         → Tier 2 features (se houver tempo)
```

---

## 🚀 COMEÇAR AGORA!

```
1. Abrir http://localhost:5173
2. Cmd+Shift+M (Mobile view)
3. Registrar com email teste_e2e_001@email.com
4. Preencher formulário
5. Começar testes acima
6. Documentar resultados
7. Se OK → próxima feature!
```

---

**ETA Conclusão:** 10:30  
**Status:** ⏳ COMEÇANDO AGORA  
**Prioridade:** 🔴 ALTA (descobre bugs reais)

---

💪 **Vamo fazer essa!** 💪

---
