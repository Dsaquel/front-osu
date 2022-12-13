<script setup lang="ts">
const { user } = userStore();
</script>

<template>
  <div class="area" grid="~ flow-col cols-[110px_1fr] rows-[110px_1fr]" w="full" h="110vh" overflow="hidden">
    <ToolbarLayout :user="user" />
    <NavigationDrawer :user="user" class="sidebar" />
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.area {
  grid-template-areas:
    '. .'
    'sidebar main';

  .sidebar {
    grid-area: sidebar;
  }
  .main {
    grid-area: main;
  }
}
</style>
