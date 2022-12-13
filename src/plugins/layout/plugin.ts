import { App } from 'vue';
import LayoutSystem from './LayoutSystem.vue';

interface PluginOptions {
  componentName?: string;
  defaultLayout: string;
  layouts: any[];
}

// eslint-disable-next-line import/no-mutable-exports
export let params: PluginOptions = {
  componentName: 'LayoutSystem',
  defaultLayout: '',
  layouts: [],
};
export function install(app: App, args: PluginOptions) {
  params = Object.assign(params, args);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  app.component(params.componentName!, LayoutSystem);
}
