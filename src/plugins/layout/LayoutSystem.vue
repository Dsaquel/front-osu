<script setup lang="ts">
import { params } from './plugin';

const layout = ref();
const route = useRoute();
watch(
  () => route.meta,
  async (meta) => {
    layout.value = meta.layout || params.defaultLayout;
  },
);
</script>

<template>
  <component :is="layout">
    <slot />
  </component>
</template>
