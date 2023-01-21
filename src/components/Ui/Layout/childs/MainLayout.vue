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
<!-- add pos relative and set overflow auto -->
<template>
  <main pos="relative" p="5" h="min-full" overflow="auto">
    <router-view :class="{ 'sm:max-w-900px mx-auto': minWindow }" />
  </main>
</template>

<style scoped lang="scss">
main {
  grid-area: main;
}
</style>
