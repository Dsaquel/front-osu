<script setup lang="ts">
const { user } = userStore();
</script>

<template>
  <div
    class="area"
    grid="~ cols-[110px_1fr] rows-[110px_1fr] <sm:rows-[110px_50px_1fr]"
    w="full"
    h="100vh"
    sm:justify="between"
    overflow="hidden"
  >
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
  @media screen and (max-width: 640px) {
    grid-template-areas:
      '. .'
      'sidebar sidebar'
      'main main';
  }

  .sidebar {
    grid-area: sidebar;
  }
  .main {
    grid-area: main;
  }
}
</style>
