# 📝 User Stories – Escambo

## Formato

> **Como** [tipo de usuário], **quero** [ação], **para** [benefício].

---

## 🔐 Épico: Autenticação

### US-001 – Cadastro de usuário
**Como** visitante, **quero** me cadastrar com nome, e-mail e telefone, **para** poder usar a plataforma de trocas.

**Critérios de aceite:**
- Formulário com campos: nome, e-mail, telefone, senha
- Validação de e-mail único
- Validação de formato de telefone
- Senha com mínimo de 6 caracteres
- Feedback visual de sucesso/erro

### US-002 – Login
**Como** usuário cadastrado, **quero** fazer login com e-mail e senha, **para** acessar minha conta.

**Critérios de aceite:**
- Login com e-mail + senha
- Token JWT retornado e armazenado
- Redirect para feed após login
- Mensagem de erro para credenciais inválidas

### US-003 – Logout
**Como** usuário logado, **quero** sair da minha conta, **para** proteger meus dados.

**Critérios de aceite:**
- Botão de logout no perfil
- Token removido do localStorage
- Redirect para tela de login

### US-004 – Manter sessão
**Como** usuário, **quero** que minha sessão seja mantida enquanto o token for válido, **para** não precisar fazer login toda vez.

**Critérios de aceite:**
- Token JWT persistido no localStorage
- Auto-refresh do token (opcional)
- Redirect para login quando token expirar

---

## 📦 Épico: Itens

### US-005 – Criar item
**Como** usuário logado, **quero** publicar um item para troca, **para** que outros possam vê-lo.

**Critérios de aceite:**
- Formulário: título, descrição, categoria, condição
- Upload de 1 a 5 fotos
- Foto principal selecionável
- Item aparece no feed após criação

### US-006 – Editar item
**Como** dono de um item, **quero** editar suas informações, **para** corrigir ou atualizar dados.

**Critérios de aceite:**
- Apenas o dono pode editar
- Todos os campos editáveis
- Fotos podem ser adicionadas/removidas

### US-007 – Remover item
**Como** dono de um item, **quero** removê-lo da plataforma, **para** quando não quiser mais trocar.

**Critérios de aceite:**
- Apenas o dono pode remover
- Confirmação antes de remover
- Item não aparece mais no feed

### US-008 – Upload de fotos
**Como** usuário, **quero** enviar fotos dos meus itens, **para** mostrá-los visualmente.

**Critérios de aceite:**
- Upload de imagens (JPG, PNG, WebP)
- Limite de 5 fotos por item
- Tamanho máximo: 5MB por foto
- Preview antes do envio
- Compressão automática

### US-009 – Navegar pelo feed
**Como** usuário logado, **quero** ver itens de outros usuários no feed, **para** encontrar itens que me interessam.

**Critérios de aceite:**
- Feed em grid (estilo Instagram)
- Scroll infinito
- Não mostrar meus próprios itens
- Lazy loading de imagens
- Filtro por categoria (opcional)

---

## ❤️ Épico: Curtidas

### US-010 – Curtir item (swipe right)
**Como** usuário, **quero** curtir um item fazendo swipe para a direita, **para** demonstrar interesse na troca.

**Critérios de aceite:**
- Swipe right = curtir
- Animação visual de "gostei"
- Curtida registrada no backend
- Não é possível curtir o próprio item

### US-011 – Rejeitar item (swipe left)
**Como** usuário, **quero** rejeitar um item fazendo swipe para a esquerda, **para** indicar que não tenho interesse.

**Critérios de aceite:**
- Swipe left = não gostei
- Animação visual de descarte
- Item não aparece novamente

### US-012 – Ver quem curtiu meus itens
**Como** dono de itens, **quero** ver quem curtiu meus itens, **para** saber quem está interessado.

**Critérios de aceite:**
- Lista de curtidas recebidas
- Nome e item curtido visíveis
- Possibilidade de ver itens do interessado

---

## 🔄 Épico: Match

### US-013 – Match automático
**Como** usuário, **quero** que o sistema detecte automaticamente quando há interesse mútuo, **para** conectar as duas partes.

**Critérios de aceite:**
- Match ocorre quando A curte item de B **E** B curte item de A
- Notificação instantânea para ambos
- Match registrado no banco de dados
- Animação de "Match!" na tela

### US-014 – Ver meus matches
**Como** usuário, **quero** ver uma lista dos meus matches, **para** gerenciar minhas possíveis trocas.

**Critérios de aceite:**
- Lista ordenada por data (mais recente primeiro)
- Mostrar itens envolvidos
- Mostrar última mensagem do chat
- Indicador de mensagens não lidas

---

## 💬 Épico: Chat

### US-015 – Exibir anúncio antes do chat
**Como** plataforma, **quero** exibir um anúncio patrocinado antes de liberar o chat, **para** monetizar a aplicação.

**Critérios de aceite:**
- Anúncio exibido apenas na primeira vez de cada match
- Duração: 30 a 60 segundos
- Botão "Pular" após tempo mínimo (15s)
- Registro de impressão
- Registro de clique (se houver)

### US-016 – Enviar mensagens
**Como** usuário com match, **quero** enviar mensagens de texto, **para** combinar a troca.

**Critérios de aceite:**
- Mensagens em tempo real (WebSocket)
- Persistência no banco de dados
- Indicador de mensagem enviada/lida
- Ordenação cronológica

### US-017 – Receber mensagens em tempo real
**Como** usuário, **quero** receber mensagens instantaneamente, **para** ter uma conversa fluida.

**Critérios de aceite:**
- Notificação visual de nova mensagem
- Atualização automática do chat
- Badge de mensagens não lidas
- Funcionar com app em background (push, opcional)

---

## 📢 Épico: Anúncios

### US-018 – Cadastrar anúncio (admin)
**Como** administrador, **quero** cadastrar anúncios patrocinados, **para** monetizar a plataforma.

**Critérios de aceite:**
- CRUD de anúncios
- Upload de imagem
- Definir duração e URL de redirecionamento
- Ativar/desativar anúncio

### US-019 – Relatório de anúncios (admin)
**Como** administrador, **quero** ver métricas dos anúncios, **para** reportar aos anunciantes.

**Critérios de aceite:**
- Contagem de impressões
- Contagem de cliques
- Taxa de cliques (CTR)

---

## 📱 Épico: PWA

### US-020 – Instalar como app
**Como** usuário, **quero** instalar o Escambo na tela inicial do meu celular, **para** acessar como um app nativo.

**Critérios de aceite:**
- Prompt de instalação (A2HS)
- Ícone na tela inicial
- Splash screen ao abrir
- Abrir em modo standalone

### US-021 – Usar offline
**Como** usuário, **quero** navegar pelos itens já carregados mesmo sem internet, **para** não perder a experiência.

**Critérios de aceite:**
- Feed funciona offline (dados em cache)
- Fotos em cache disponíveis offline
- Indicador visual de modo offline
- Ações pendentes sincronizadas ao reconectar

### US-022 – Performance otimizada
**Como** usuário, **quero** que o app carregue rapidamente, **para** ter uma boa experiência.

**Critérios de aceite:**
- Lighthouse Performance > 90
- Lighthouse PWA > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s

---

## 👤 Épico: Perfil

### US-023 – Ver meu perfil
**Como** usuário, **quero** ver meu perfil com meus itens publicados, **para** gerenciar minha conta.

**Critérios de aceite:**
- Foto, nome, e-mail visíveis
- Lista dos meus itens
- Botão para editar perfil
- Botão para adicionar novo item

### US-024 – Editar perfil
**Como** usuário, **quero** editar meu nome e foto, **para** manter meu perfil atualizado.

**Critérios de aceite:**
- Editar nome
- Upload de avatar
- Salvar alterações
