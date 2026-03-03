# 🧪 E2E TESTING - EXECUÇÃO PRÁTICA (10:00 - 10:30)

## 🎯 OBJETIVO

Executar fluxo completo e validar que SWIPE GESTURES funciona com outros sistemas do app.

---

## 📋 TESTES EXECUTADOS

### TESTE 1: LOGIN (2 min)

```
✅ STATUS: COMEÇANDO
┌─────────────────────────────────────┐
│ Ir para: http://localhost:5173      │
│ Se não autenticado → vai para login │
│ Usar credentials de teste anterior: │
│ Email: teste_e2e_001@email.com      │
│ Senha: Test@123456                  │
└─────────────────────────────────────┘

CHECKLIST:
[ ] Login page carrega
[ ] Email field recebe input
[ ] Senha field recebe input
[ ] Botão "Entrar" ativado quando preenchido
[ ] POST /api/auth/login feito
[ ] Redireciona para /feed
[ ] Sem console errors
[ ] Token salvo em localStorage

RESULTADO: [ ] ✅ PASSOU [ ] ❌ FALHOU
```

---

### TESTE 2: FEED CARREGA (2 min)

```
✅ STATUS: PRÓXIMO
┌─────────────────────────────────────┐
│ ROTA: http://localhost:5173/feed    │
│ Abrir DevTools (F12)                │
│ Ativar Mobile View (Cmd+Shift+M)    │
│ Escolher: iPhone 12 Pro             │
└─────────────────────────────────────┘

CHECKLIST:
[ ] Feed view carrega
[ ] Items aparecem em grid
[ ] Imagens carregam (mostra fotos reais)
[ ] Categorias visíveis nos badges
[ ] Botões de filtro (Todos, Eletrônicos, etc) aparecem
[ ] Sem console errors
[ ] Network tab: GET /api/items 200 OK

RESULTADO: [ ] ✅ PASSOU [ ] ❌ FALHOU
```

---

### TESTE 3: SWIPE GESTURES - DIREITA (3 min) ⭐ NOVO!

```
✅ STATUS: CRÍTICO
┌─────────────────────────────────────┐
│ Fazer SWIPE DIREITA em um item      │
│ Arrastar pelo menos 100px           │
│ Observar visual feedback            │
└─────────────────────────────────────┘

CHECKLIST:
[ ] Enquanto arrasta apareça coração verde (♥)?
[ ] Transição suave do movimento?
[ ] Ao soltar:
    [ ] Item desaparece/sai da tela?
    [ ] Network tab: POST /api/likes 201?
    [ ] Response mostra: { match: true/false }?
[ ] Próximo item sobe automaticamente?
[ ] Sem console errors?
[ ] Sem erro "Cannot read properties of null"?

RESULTADO: [ ] ✅ PASSOU [ ] ❌ FALHOU

BUGS ENCONTRADOS (se houver):
└─ [anote aqui]
```

---

### TESTE 4: SWIPE GESTURES - ESQUERDA (3 min) ⭐ NOVO!

```
✅ STATUS: CRÍTICO
┌─────────────────────────────────────┐
│ Fazer SWIPE ESQUERDA em um item     │
│ Arrastar pelo menos 100px para left │
│ Observar visual feedback            │
└─────────────────────────────────────┘

CHECKLIST:
[ ] Enquanto arrasta apareça X vermelho (✗)?
[ ] Transição suave do movimento?
[ ] Ao soltar:
    [ ] Item desaparece/sai da tela?
    [ ] Network tab: DELETE /api/likes 200?
[ ] Próximo item sube automaticamente?
[ ] Sem console errors?

RESULTADO: [ ] ✅ PASSOU [ ] ❌ FALHOU

BUGS ENCONTRADOS (se houver):
└─ [anote aqui]
```

---

### TESTE 5: CLICK NORMAL (2 min)

```
✅ STATUS: DEPOIS DO SWIPE
┌─────────────────────────────────────┐
│ Fazer TAP RÁPIDO (click) em um item │
│ Sem arrastar                        │
│ Deve abrir detalhe, não like        │
└─────────────────────────────────────┘

CHECKLIST:
[ ] Item detail page abre (/items/{id})?
[ ] Foto grande aparece?
[ ] Título, descrição visíveis?
[ ] Info do dono (nome, city) visível?
[ ] Botão ♡ para like manualmente?
[ ] Botão para conversar?
[ ] Sem console errors?

RESULTADO: [ ] ✅ PASSOU [ ] ❌ FALHOU
```

---

### TESTE 6: VOLTAR AO FEED (2 min)

```
✅ STATUS: DEPOIS DO DETALHE
┌─────────────────────────────────────┐
│ Clicar em voltar/← do app           │
│ Ou clique em Feed abas              │
└─────────────────────────────────────┘

CHECKLIST:
[ ] Volta para /feed?
[ ] Items que curtiu não aparecem?
[ ] Novos items disponíveis para swipe?
[ ] Feed state foi preservado?
[ ] Sem console errors?

RESULTADO: [ ] ✅ PASSOU [ ] ❌ FALHOU
```

---

### TESTE 7: MEUS ITENS (2 min)

```
✅ STATUS: VALIDAÇÃO SECUNDÁRIA
┌─────────────────────────────────────┐
│ Clicar em abas: 📦 Meus Itens       │
│ ROTA: http://localhost:5173/my-items│
└─────────────────────────────────────┘

CHECKLIST:
[ ] Meus itens carregam?
[ ] Mostra items criados por você?
[ ] Tem botão Editar (✏️)?
[ ] Tem botão Deletar (🗑️)?
[ ] Clique Editar → abre editor?
[ ] Sem console errors?

RESULTADO: [ ] ✅ PASSOU [ ] ❌ FALHOU
```

---

### TESTE 8: MATCHES (2 min)

```
✅ STATUS: VALIDAÇÃO SECUNDÁRIA
┌─────────────────────────────────────┐
│ Clicar em abas: 💜 Matches          │
│ ROTA: http://localhost:5173/matches │
└─────────────────────────────────────┘

CHECKLIST:
[ ] Matches page carrega?
[ ] Se tiver matches, mostra lista?
[ ] Cada match mostra usuário + última msg?
[ ] Clique em match → abre chat?
[ ] Se não tiver, mostra "Nenhum match"?
[ ] Sem console errors?

RESULTADO: [ ] ✅ PASSOU [ ] ❌ FALHOU
```

---

### TESTE 9: PROFILE (2 min)

```
✅ STATUS: VALIDAÇÃO SECUNDÁRIA
┌─────────────────────────────────────┐
│ Clicar em abas: 👤 Profile          │
│ ROTA: http://localhost:5173/profile │
└─────────────────────────────────────┘

CHECKLIST:
[ ] Profile page carrega?
[ ] Avatar visível?
[ ] Nome, bio, cidade visível?
[ ] Botão Editar funciona?
[ ] Clique editar → vai para /edit-profile?
[ ] Sem console errors?

RESULTADO: [ ] ✅ PASSOU [ ] ❌ FALHOU
```

---

## 📊 RESUMO TESTES

```
TOTAL TESTES: 9
Tempo estimado: 22 minutos (buffer: 8 min)
═════════════════════════════════════════

CRÍTICOS (SWIPE):
[_] TESTE 3: Swipe Direita (LIKE)
[_] TESTE 4: Swipe Esquerda (UNLIKE)

ESSENCIAIS:
[_] TESTE 1: Login
[_] TESTE 2: Feed Carrega
[_] TESTE 5: Click Normal
[_] TESTE 6: Voltar ao Feed

SECUNDÁRIOS (se houver tempo):
[_] TESTE 7: Meus Itens
[_] TESTE 8: Matches
[_] TESTE 9: Profile

═════════════════════════════════════════
RESULTADO FINAL:
├─ Críticos: ___/2 ✅
├─ Essenciais: ___/4 ✅
├─ Secundários: ___/3 ✅
└─ TOTAL: ___/9 ✅
```

---

## 🐛 BUGS ENCONTRADOS

```
BUG #1
─────────────────────────────────────
Título: [descrever]
Severidade: [ ] Critical [ ] High [ ] Medium [ ] Low
Reproduzir:
1. [passo 1]
2. [passo 2]
3. [passo 3]
Esperado: [o que deveria acontecer]
Atual: [o que acontece]
Evidência: [screenshot/console/network]
─────────────────────────────────────

BUG #2
─────────────────────────────────────
[repetir formato acima]
─────────────────────────────────────
```

---

## ⏱️ TIMELINE

```
10:00 - 10:02  TESTE 1: Login
10:02 - 10:04  TESTE 2: Feed Carrega
10:04 - 10:07  TESTE 3: Swipe Direita ⭐
10:07 - 10:10  TESTE 4: Swipe Esquerda ⭐
10:10 - 10:12  TESTE 5: Click Normal
10:12 - 10:14  TESTE 6: Voltar ao Feed
10:14 - 10:16  TESTE 7: Meus Itens (se tempo)
10:16 - 10:18  TESTE 8: Matches (se tempo)
10:18 - 10:20  TESTE 9: Profile (se tempo)
10:20 - 10:30  Documentar bugs + Buffer
─────────────────────────────────────
TOTAL: 30 minutos
```

---

## ✅ CONCLUSÃO

```
Se TODOS os testes críticos passarem:
├─ Swipe direita OK
├─ Swipe esquerda OK
├─ Click normal OK
├─ Feed OK
└─ Sem console errors

RESULTADO: ✅ PRONTO PARA LIGHTBOX!

Se algum crítico falhar:
├─ Documentar bug exato
├─ Printscreen de console
├─ Network tab request/response
└─ Tentar reproduzir 2x para confirmar
```

---

## 🎯 PRÓXIMO (Se OK)

```
10:30 - 11:00: 📸 LIGHTBOX IMPLEMENTATION
└─ Instalar vue-easy-lightbox
└─ Integrar em ItemDetailView
└─ Testar click em foto → abre modal
```

---

**Hora de começar:** 10:00  
**Duração:** 30 minutos  
**Status:** ⏳ PRONTO PARA COMEÇAR  

---

🚀 **Vamo fazer E2E testing!** 🚀

Comece pelo TESTE 1: LOGIN

---
