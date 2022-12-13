<script setup lang="ts">
const { user } = userStore();
</script>

<template>
  <div class="area" grid="~ flow-col cols-[110px_1fr] rows-[110px_1fr]" w="full" h="110vh" overflow="hidden">
    <ToolbarLayout :user="user" />
    <NavigationDrawer :user="user" class="sidebar" />
    <MainLayout class="main" />
  </div>
  <router-view />
</template>

<style scoped lang="scss">
.area {
  grid-template-areas:
    '. .'
    'sidebar main';

  .sidebar {
    grid-area: sidebar;
  }
  .sidebar {
    grid-area: main;
  }
}
</style>
