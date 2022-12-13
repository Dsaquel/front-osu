import { App } from 'vue';
import AppLayout from './components/ui/layout/AppLayout.vue';

const initLayouts = async (app: App) => {
  app.component('AppLayout', AppLayout);
};

export default initLayouts;
