<script setup lang="ts"></script>

<template>
  <main>
    <router-view h="min-full" />
  </main>
</template>

<style scoped lang="scss">
main {
  grid-area: main;
  display: block;
  overflow: hidden;
}
</style>
