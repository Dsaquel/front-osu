<template>
  <div container="~">
    <NavHome />
  </div>
</template>

<script setup lang="ts">
// const { t } = useI18n();
ElMessage.success({ message: 'welcome', duration: 1000 });
</script>

<style lang="scss" scoped>
a {
  @apply text-sky-400 hover:(text-sky-600) transition-all ease-out duration-100;
}
</style>
