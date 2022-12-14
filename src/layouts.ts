import { App } from 'vue';
import AppLayout from './components/Ui/Layout/AppLayout.vue';

const initLayouts = async (app: App) => {
  app.component('AppLayout', AppLayout);
};

export default initLayouts;
