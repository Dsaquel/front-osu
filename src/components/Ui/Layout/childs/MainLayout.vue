<script setup lang="ts"></script>

<template>
  <main p="5" h="min-full" overflow="y-scroll">
    <router-view />
  </main>
</template>

<style scoped lang="scss">
main {
  grid-area: main;
}
</style>
