# 📋 GUIA IMPLEMENTAÇÃO - FEATURES CRÍTICAS

## 1️⃣ SWIPE GESTURES NO FEED

### Passo 1: Instalar biblioteca

```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp/frontend
npm install vue-swipe-mobile
# OU se preferir hammer.js:
npm install hammerjs
```

### Passo 2: Modificar FeedItem.vue

Adicionar detecção de swipe no template:

```vue
<!-- Envolver imagem em div com evento de swipe -->
<div class="feed-item__swipe-container" @swipeleft="handleSwipeLeft" @swiperight="handleSwipeRight">
  <img 
    v-if="primaryPhoto" 
    :src="primaryPhoto" 
    :alt="item.title" 
    class="img-fluid feed-item__image-swipeable"
  />
</div>
```

No script:
```javascript
const handleSwipeRight = async () => {
  // Curtir item
  try {
    await likeStore.toggleLike(item.id);
    console.log('Curtiu!');
  } catch (e) {
    console.error(e);
  }
};

const handleSwipeLeft = async () => {
  // Descurtir (se já curtiu)
  try {
    // Chamar endpoint para descurtir
  } catch (e) {
    console.error(e);
  }
};
```

### Passo 3: Adicionar feedback visual

CSS SCSS:
```scss
.feed-item__swipe-container {
  position: relative;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
  
  .feed-item__image-swipeable {
    transition: opacity 0.2s;
    
    &.swiping-left {
      opacity: 0.7;
      transform: translateX(-10px);
    }
    
    &.swiping-right {
      opacity: 0.7;
      transform: translateX(10px);
    }
  }
}
```

### Passo 4: Testar

1. Ir para `/feed`
2. Tentar swipe direita (deve curtir)
3. Tentar swipe esquerda (deve descurtir ou ignorar)
4. Verificar no console se está funcionando

---

## 2️⃣ LIGHTBOX PARA FOTOS

### Passo 1: Instalar biblioteca

```bash
npm install vue-easy-lightbox
```

### Passo 2: Modificar ItemDetailView.vue

No template:
```vue
<template>
  <div class="item-detail-view">
    <!-- ... resto do conteúdo ... -->
    
    <div class="item-photos mb-4">
      <img
        v-for="(photo, idx) in item.photos"
        :key="photo.id"
        :src="getPhotoUrl(photo)"
        alt="Item photo"
        class="img-fluid item-photo-thumb"
        @click="openLightbox(idx)"
      />
    </div>

    <!-- Lightbox component -->
    <Lightbox
      :imgs="photoUrls"
      :visible.sync="lightboxVisible"
      :index="lightboxIndex"
    />
  </div>
</template>
```

No script:
```javascript
import Lightbox from 'vue-easy-lightbox';

export default {
  components: {
    Lightbox,
  },
  
  data() {
    return {
      lightboxVisible: false,
      lightboxIndex: 0,
    };
  },
  
  computed: {
    photoUrls() {
      const BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');
      return (this.item.photos || []).map(p => `${BASE_URL}${p.url}`);
    },
  },
  
  methods: {
    openLightbox(index) {
      this.lightboxIndex = index;
      this.lightboxVisible = true;
    },
    
    getPhotoUrl(photo) {
      const BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');
      return `${BASE_URL}${photo.url}`;
    },
  },
};
```

### Passo 3: Testar

1. Ir para `/items/2`
2. Clicar em uma foto
3. Deve abrir lightbox
4. Tentar navegar com arrows/swipe

---

## 3️⃣ INDICADOR OFFLINE

### Passo 1: Criar componente

Criar arquivo: `frontend/src/components/common/OfflineIndicator.vue`

```vue
<template>
  <div v-if="!isOnline" class="offline-indicator">
    <div class="offline-indicator__content">
      <span class="offline-indicator__icon">📡❌</span>
      <span class="offline-indicator__text">Sem conexão</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isOnline = ref(navigator.onLine);

const handleOnline = () => {
  isOnline.value = true;
};

const handleOffline = () => {
  isOnline.value = false;
};

onMounted(() => {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
});

onUnmounted(() => {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
});
</script>

<style scoped lang="scss">
.offline-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #dc3545;
  color: white;
  padding: 8px;
  text-align: center;
  font-size: 0.9rem;
  z-index: 2000;
  animation: slideDown 0.3s ease;
  
  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  &__icon {
    font-size: 1.2rem;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
```

### Passo 2: Adicionar em App.vue

```vue
<template>
  <div id="app">
    <OfflineIndicator />
    <!-- resto da app -->
  </div>
</template>

<script setup>
import OfflineIndicator from '@/components/common/OfflineIndicator.vue';
</script>
```

### Passo 3: Testar

1. Abrir DevTools (F12)
2. Ir para Network tab
3. Clicar em "Offline" (canto superior esquerdo)
4. Deve aparecer a barra vermelha
5. Voltar para "Online"
6. Barra deve desaparecer

---

## 4️⃣ VALIDAÇÃO DE CATEGORIAS

### Passo 1: Criar lista válida

Editar `backend/src/validators/itemValidator.js`:

```javascript
const VALID_CATEGORIES = [
  'Eletrônicos', 'Roupas', 'Livros', 'Esportes',
  'Móveis', 'Games', 'Instrumentos', 'Veículos',
  'Colecionáveis', 'Outros'
];

const createItemSchema = joi.object({
  title: joi.string().required().min(3).max(100),
  description: joi.string().required().min(10).max(5000),
  category: joi.string()
    .valid(...VALID_CATEGORIES)
    .required()
    .messages({
      'any.only': `Categoria inválida. Use uma de: ${VALID_CATEGORIES.join(', ')}`
    }),
  condition: joi.string().valid('novo', 'seminovo', 'usado', 'desgastado').required(),
  trade_for: joi.string().max(500),
});
```

### Passo 2: Testar

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test item","category":"INVALID","condition":"novo"}'
# Deve retornar erro 400 com mensagem sobre categoria inválida
```

---

## 5️⃣ TESTE E2E COMPLETO

### Manual Testing Checklist:

```
[ ] 1. CADASTRO
    [ ] Ir para /register
    [ ] Preencher nome, email, phone, password
    [ ] Clicar "Cadastrar"
    [ ] Deve redirecionar para /feed após login automático

[ ] 2. LOGIN (SEGUNDO USUÁRIO)
    [ ] Logout do primeiro
    [ ] /login com segundo usuário
    [ ] Deve entrar no /feed

[ ] 3. CRIAR ITEM (USUÁRIO 1)
    [ ] Voltar ao primeiro usuário
    [ ] /items/new
    [ ] Preencher: título, descrição, categoria, condição
    [ ] Upload 2-3 fotos
    [ ] Criar
    [ ] Deve aparecer em /feed

[ ] 4. CURTIR (USUÁRIO 2)
    [ ] Como usuário 2, ir para /feed
    [ ] Encontrar item de usuário 1
    [ ] Curtir (clique no coração OU swipe direita)
    [ ] Deve marcar como curtido

[ ] 5. FAZER MATCH (USUÁRIO 1 CURTE ITEM DE 2)
    [ ] Como usuário 1, curtir qualquer item de usuário 2
    [ ] Deve aparecer notificação "Match!" para ambos
    [ ] /matches deve mostrar novo match

[ ] 6. ABRIR CHAT
    [ ] Clique no match
    [ ] Deve mostrar anúncio por 30s
    [ ] Após anúncio, campo de chat liberado
    [ ] Escrever mensagem
    [ ] Enviar

[ ] 7. RECEBER MENSAGEM (OUTRO NAVEGADOR)
    [ ] Abrir outro navegador (ou abrir app em outra janela incógnita)
    [ ] Login como usuário 2
    [ ] Ir para chat do match
    [ ] Deve receber mensagem de usuário 1 em tempo real
    [ ] Responder
    [ ] Usuário 1 deve receber em tempo real

[ ] 8. EDITAR PERFIL
    [ ] /profile/edit
    [ ] Alterar nome, bio, city, state
    [ ] Upload avatar (clique na foto)
    [ ] Salvar
    [ ] Avatar deve aparecer atualizado

[ ] 9. EDITAR ITEM
    [ ] /my-items
    [ ] Clicar em ícone editar (✏️) em um item
    [ ] Alterar descrição
    [ ] Adicionar/remover foto
    [ ] Salvar
    [ ] Mudanças devem aparecer

[ ] 10. FILTRO DE CATEGORIA
     [ ] /feed
     [ ] Clicar em categoria (ex: "Eletrônicos")
     [ ] Deve filtrar apenas itens dessa categoria
     [ ] Mudar de categoria
     [ ] Deve recarregar feed

RESULTADO: ✅ Todos os checks devem passar
```

---

## 🎯 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

### **HOJE - Executar nesta ordem:**

1. **Swipe Gestures** (45 min)
   - Instalar + implementar
   - Testar funcionando

2. **Lightbox** (30 min)
   - Instalar + adicionar em detail view
   - Testar galeria abrindo

3. **Offline Indicator** (20 min)
   - Criar componente
   - Adicionar em App.vue
   - Testar desconectando WiFi

4. **Validar Categorias** (20 min)
   - Atualizar validator
   - Testar com curl inválido

5. **E2E Manual** (30 min)
   - Executar checklist acima
   - Documentar qualquer bug

**Total: ~2h 45min para deixar app PRONTO**

---

## 🐛 DEBUGGING TIPS

Se algo não funcionar:

1. **Frontend console (F12):** Abrir DevTools → Console
   - Procurar por erros vermelhos
   - Usar `console.log()` para debug

2. **Network tab:** Verificar requisições HTTP
   - Status 200 = sucesso
   - Status 4xx = erro do frontend
   - Status 5xx = erro do backend

3. **Backend logs:** Terminal onde npm start está rodando
   - Procurar por `[error]` vermelho
   - Verificar winston logs em `/backend/logs` se existir

4. **Database:** Conectar ao MySQL
   ```bash
   mysql -u root -p escambo_db
   SELECT * FROM items LIMIT 5;
   ```

5. **Socket.io debug:**
   ```javascript
   // No frontend console
   io.connect('http://localhost:3000', {
     debug: true
   });
   ```

---

**Boa implementação! Qualquer dúvida, releia este guia. 🚀**
