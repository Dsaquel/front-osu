/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '~icons/*' {
  import { FunctionalComponent, SVGAttributes } from 'vue';
  const component: FunctionalComponent<SVGAttributes>;
  export default component;
}

declare module '*.md' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare interface ImportMetaEnv {
  readonly VITE_BASE: string;
  readonly VITE_API_DEV_BASEURL: string;
  readonly VITE_API_PROD_BASEURL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_OSU_DEV_CALLBACK_URL: string
  readonly VITE_OSU_PROD_CALLBACK_URL: string
  readonly VITE_TINY_API_KEY: string
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare interface Window {
  // extend the window
}
