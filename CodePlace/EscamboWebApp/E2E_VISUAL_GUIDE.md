# 📸 E2E TESTING - VISUAL GUIDE

## TESTE 3: SWIPE DIREITA (Like) - O QUE VER

```
ANTES:
┌─────────────────┐
│                 │
│    Imagem       │
│                 │
├─────────────────┤
│ Título Item     │
│ Seminovo        │
└─────────────────┘

DURANTE SWIPE DIREITA:
┌─────────────────┐  
│ 💚              │
│    Imagem       │ → Transição suave
│   [arrasta]     │
├─────────────────┤
│ Título Item     │
│ Seminovo        │
└─────────────────┘

ESPERADO:
✓ Coração verde (♥) aparece
✓ Card se move para direita
✓ Gradiente verde ao fundo
✓ Animação suave (0.1s)
✓ Network: POST /api/likes → 201 Created

DEPOIS:
Card desaparece e próximo item sobe
```

---

## TESTE 4: SWIPE ESQUERDA (Unlike) - O QUE VER

```
ANTES:
┌─────────────────┐
│                 │
│    Imagem       │
│                 │
├─────────────────┤
│ Título Item     │
│ Seminovo        │
└─────────────────┘

DURANTE SWIPE ESQUERDA:
┌─────────────────┐  
│              ❌ │
│    Imagem       │ ← Transição suave
│ [arrasta left]  │
├─────────────────┤
│ Título Item     │
│ Seminovo        │
└─────────────────┘

ESPERADO:
✓ X vermelho (✗) aparece
✓ Card se move para esquerda
✓ Gradiente vermelho ao fundo
✓ Animação suave (0.1s)
✓ Network: DELETE /api/likes → 200 OK

DEPOIS:
Card desaparece e próximo item sobe
```

---

## VISUAL ESPERADO NO CONSOLE

```
Network Tab (F12 → Network):
────────────────────────────
POST /api/likes
├─ Status: 201 Created
├─ Method: POST
├─ Body: { item_id: 2 }
└─ Response: { liked: true, match: false }

DELETE /api/likes
├─ Status: 200 OK
├─ Method: DELETE
└─ Response: { success: true }
```

---

## CONSOLE (F12 → Console)

```
✅ ESPERADO:
└─ Nenhum erro relacionado a swipe
└─ Nenhum "Cannot read properties of null"
└─ Nenhum "undefined is not a function"

❌ NÃO ESPERADO:
└─ Qualquer erro em vermelho
└─ TypeError ou ReferenceError
└─ CORS errors
```

---

## MOBILE VIEW CHECK

```
DevTools:
✓ F12 aberto
✓ Device Toolbar ativo (Cmd+Shift+M)
✓ iPhone 12 Pro (390x844)
✓ Responsive mode ligado

Comportamento:
✓ Touch events funcionando
✓ Sem mouse cursor visível (apenas toque)
✓ Cards responsivos (2 colunas no mobile)
```

---

## PERFORMANCE ESPERADA

```
Swipe Response Time:
├─ Detecção: <50ms
├─ Visual feedback: Imediato
├─ API call: <200ms
└─ Total: <500ms

Network:
├─ POST /api/likes: 100-300ms
├─ DELETE /api/likes: 100-300ms
└─ Sem timeout (>5000ms)
```

---

## EXEMPLOS DE BUGS

### ❌ BUG: Swipe não funciona
```
Causa possível:
- Threshold muito alto
- Touch events não registrando
- CSS overflow hidden bloqueando

Verificar:
1. F12 → Network → nenhuma call feita?
2. F12 → Console → erro?
3. Device modo desktop? Trocar para mobile
```

### ❌ BUG: Cor não aparece
```
Causa possível:
- CSS não carregou
- z-index errado
- Display none no .swipe-layer

Verificar:
1. F12 → Elements → procurar .swipe-layer
2. Checked styles → overflow, display, opacity
3. Forçar refresh (Cmd+R)
```

### ❌ BUG: API não chamada
```
Causa possível:
- likesStore não inicializado
- Erro no composable useSwipe
- Token expirado

Verificar:
1. F12 → Network → POST não aparece?
2. F12 → Console → erro de auth?
3. localStorage → token presente?
```

---

## ✅ TESTE PASSOU QUANDO

```
Você verá:
✓ Coração/X aparece ao arrastar
✓ Card se move suavemente
✓ Ao soltar, card desaparece
✓ Network tab mostra POST/DELETE
✓ Status code 201 ou 200
✓ Próximo item sube
✓ Sem console errors
✓ Tudo rápido (<500ms)
```

---

## 📝 SE DER ERRO

```
1. Print screenshot
2. Copie erro do console
3. Anote url exata
4. Anote passos para reproduzir
5. Documente em E2E_TESTING_MANUAL.md
6. Continue com próximos testes
```

---

**Duração esperada:** 3 minutos por teste  
**Próximo:** TESTE 5 se passar  
**Status:** ✅ PRONTO PARA EXECUTAR

---
