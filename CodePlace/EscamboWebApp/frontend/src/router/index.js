import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/',
    name: 'splash',
    component: () => import('@/views/SplashView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/feed',
    name: 'feed',
    component: () => import('@/views/FeedView.vue'),
    meta: { auth: true },
  },
  {
    path: '/items/new',
    name: 'create-item',
    component: () => import('@/views/CreateItemView.vue'),
    meta: { auth: true },
  },
  {
    path: '/my-items',
    name: 'my-items',
    component: () => import('@/views/MyItemsView.vue'),
    meta: { auth: true },
  },
  {
    path: '/items/:id',
    name: 'item-detail',
    component: () => import('@/views/ItemDetailView.vue'),
    meta: { auth: true },
  },
  {
    path: '/items/:id/edit',
    name: 'edit-item',
    component: () => import('@/views/EditItemView.vue'),
    meta: { auth: true },
  },
  {
    path: '/likes',
    name: 'likes',
    component: () => import('@/views/LikesView.vue'),
    meta: { auth: true },
  },
  {
    path: '/matches',
    name: 'matches',
    component: () => import('@/views/MatchesView.vue'),
    meta: { auth: true },
  },
  {
    path: '/matches/:id',
    name: 'match-detail',
    component: () => import('@/views/MatchView.vue'),
    meta: { auth: true },
  },
  {
    path: '/chat/:matchId',
    name: 'chat',
    component: () => import('@/views/ChatView.vue'),
    meta: { auth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { auth: true },
  },
  {
    path: '/profile/edit',
    name: 'edit-profile',
    component: () => import('@/views/EditProfileView.vue'),
    meta: { auth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Navigation guards
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.auth && !authStore.isAuthenticated) {
    return next({ name: 'login' });
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: 'feed' });
  }

  next();
});

export default router;
