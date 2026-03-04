import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/styles/main.scss';

const app = createApp(App);

// Vue Toastification Configuration
const toastOptions = {
  position: 'bottom-right',
  timeout: 4000,
  closeButton: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeOnClick: true,
  icon: true,
  rtl: false,
};

app.use(createPinia());
app.use(router);
app.use(useToast, toastOptions);

app.mount('#app');
