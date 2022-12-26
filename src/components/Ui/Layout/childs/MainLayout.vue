<script setup lang="ts">
withDefaults(
  defineProps<{
    minWindow: boolean;
  }>(),
  {
    minWindow: false,
  },
);
</script>

<template>
  <main p="5" h="min-full" overflow="y-scroll">
    <router-view :class="{ 'sm:max-w-900px mx-auto': minWindow }" />
  </main>
</template>

<style scoped lang="scss">
main {
  grid-area: main;
}
</style>
