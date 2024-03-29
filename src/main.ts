// i18n
import { createI18n } from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
// vue router
import router from '~/router/index';
// pinia
import store from '~/store';
import App from './App.vue';
import LayoutSystem from './plugins/layout/index';
import 'virtual:windi.css';
// Devtools: https://windicss.org/integrations/vite.html#design-in-devtools
import 'virtual:windi-devtools';
import '~/assets/styles/index.scss';
import initLayouts from './layouts';

const i18n = createI18n({
  locale: 'en',
  messages,
});
const app = createApp(App);
app.use(router).use(store);

app.use(i18n);

app.use(LayoutSystem, {
  defaultLayout: 'AppLayout',
});

initLayouts(app);

app.mount('#app');
