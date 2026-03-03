# 📁 Estrutura de Pastas – Escambo

## Visão Geral

```
EscamboWebApp/
│
├── frontend/                    # Aplicação Vue.js 3 (PWA)
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── icons/               # Ícones PWA (192x192, 512x512)
│   │   ├── manifest.json        # Manifest PWA
│   │   └── robots.txt
│   ├── src/
│   │   ├── assets/              # Imagens, fontes, estilos globais
│   │   │   ├── images/
│   │   │   │   └── logo.svg
│   │   │   └── styles/
│   │   │       ├── main.scss
│   │   │       └── _variables.scss
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── common/
│   │   │   │   ├── AppLoader.vue
│   │   │   │   ├── AppNavbar.vue
│   │   │   │   ├── AppTabBar.vue
│   │   │   │   └── OfflineIndicator.vue
│   │   │   ├── feed/
│   │   │   │   ├── FeedGrid.vue
│   │   │   │   └── FeedItem.vue
│   │   │   ├── items/
│   │   │   │   ├── ItemCard.vue
│   │   │   │   ├── ItemCarousel.vue
│   │   │   │   ├── ItemForm.vue
│   │   │   │   └── SwipeableItem.vue
│   │   │   ├── chat/
│   │   │   │   ├── ChatBubble.vue
│   │   │   │   ├── ChatInput.vue
│   │   │   │   └── ChatList.vue
│   │   │   ├── match/
│   │   │   │   ├── MatchAnimation.vue
│   │   │   │   └── MatchCard.vue
│   │   │   └── ads/
│   │   │       └── AdOverlay.vue
│   │   ├── views/               # Páginas (views)
│   │   │   ├── SplashView.vue
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   ├── FeedView.vue
│   │   │   ├── ItemDetailView.vue
│   │   │   ├── CreateItemView.vue
│   │   │   ├── LikesView.vue
│   │   │   ├── MatchesView.vue
│   │   │   ├── MatchView.vue
│   │   │   ├── ChatView.vue
│   │   │   ├── ProfileView.vue
│   │   │   └── EditProfileView.vue
│   │   ├── router/
│   │   │   └── index.js         # Vue Router config
│   │   ├── stores/              # Pinia stores
│   │   │   ├── auth.js
│   │   │   ├── items.js
│   │   │   ├── likes.js
│   │   │   ├── matches.js
│   │   │   ├── chat.js
│   │   │   └── ads.js
│   │   ├── services/            # API service layer
│   │   │   ├── api.js           # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── itemService.js
│   │   │   ├── likeService.js
│   │   │   ├── matchService.js
│   │   │   ├── chatService.js
│   │   │   └── adService.js
│   │   ├── composables/         # Vue composables
│   │   │   ├── useSwipe.js
│   │   │   ├── useOnline.js
│   │   │   └── useSocket.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   └── formatters.js
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── backend/                     # API Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # Knex config
│   │   │   ├── auth.js          # JWT config
│   │   │   ├── storage.js       # S3 config
│   │   │   └── socket.js        # Socket.io config
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── itemController.js
│   │   │   ├── likeController.js
│   │   │   ├── matchController.js
│   │   │   ├── chatController.js
│   │   │   └── adController.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── itemService.js
│   │   │   ├── likeService.js
│   │   │   ├── matchService.js
│   │   │   ├── chatService.js
│   │   │   └── adService.js
│   │   ├── repositories/
│   │   │   ├── userRepository.js
│   │   │   ├── itemRepository.js
│   │   │   ├── photoRepository.js
│   │   │   ├── likeRepository.js
│   │   │   ├── matchRepository.js
│   │   │   ├── messageRepository.js
│   │   │   └── adRepository.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Item.js
│   │   │   ├── Photo.js
│   │   │   ├── Like.js
│   │   │   ├── Match.js
│   │   │   ├── Message.js
│   │   │   └── Ad.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   ├── validationMiddleware.js
│   │   │   └── rateLimitMiddleware.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── itemValidator.js
│   │   │   └── chatValidator.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── itemRoutes.js
│   │   │   ├── likeRoutes.js
│   │   │   ├── matchRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   └── adRoutes.js
│   │   ├── sockets/
│   │   │   ├── index.js
│   │   │   └── chatHandler.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   ├── apiResponse.js
│   │   │   └── helpers.js
│   │   └── app.js
│   ├── migrations/              # Knex migrations
│   ├── seeds/                   # Knex seeds
│   ├── server.js                # Entry point
│   ├── knexfile.js              # Knex config file
│   ├── package.json
│   ├── .env.example
│   └── jest.config.js
│
├── infra/                       # Terraform (AWS)
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── provider.tf
│   ├── modules/
│   │   ├── vpc/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── ec2/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── rds/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── s3/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   ├── cloudfront/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   └── iam/
│   │       ├── main.tf
│   │       ├── variables.tf
│   │       └── outputs.tf
│   └── environments/
│       ├── dev.tfvars
│       └── prod.tfvars
│
├── tests/                       # Testes
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   └── routes/
│   └── e2e/
│       └── cypress/
│           ├── e2e/
│           ├── fixtures/
│           └── support/
│
├── docs/                        # Documentação
│   ├── PLANEJAMENTO_ESCAMBO.md
│   ├── ARQUITETURA.md
│   ├── MODELO_ER.md
│   ├── FLUXO_TELAS.md
│   ├── USER_STORIES.md
│   ├── BACKLOG.md
│   └── ESTRUTURA_PASTAS.md
│
├── .github/                     # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-dev.yml
│       └── deploy-prod.yml
│
├── .gitignore
├── .editorconfig
├── README.md
└── docker-compose.yml           # Dev environment (opcional)
```
