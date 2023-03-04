<script setup lang="ts">
// const { t } = useI18n();
ElMessage.success({ message: 'welcome', duration: 1000 });
</script>

<template>
  <div>Je suis la home page</div>
</template>

<style lang="scss" scoped>
a {
  @apply text-sky-400 hover:(text-sky-600) transition-all ease-out duration-100;
}
</style>
