import { App } from 'vue';
import LayoutSystem from './LayoutSystem.vue';

export const params = {
  componentName: 'LayoutSystem',
  defaultLayout: '',
  layouts: [],
};
export function install(app: App) {
  app.component(params.componentName, LayoutSystem);
}
