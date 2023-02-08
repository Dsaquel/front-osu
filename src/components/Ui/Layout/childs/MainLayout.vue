<script setup lang="ts">
const route = useRoute();
withDefaults(
  defineProps<{
    minWindow?: boolean;
  }>(),
  {
    minWindow: false,
  },
);
const breadcrumbs = computed(() => {
  if (typeof route.meta.breadcrumb === 'function') {
    return route.meta.breadcrumb.call(this, route);
  }
  return route.meta.breadcrumb;
});
</script>
<!-- add pos relative and set overflow auto -->
<template>
  <main pos="relative" p="5" h="min-full" overflow="auto">
    <el-breadcrumb separator="/" m="b-5">
      <template v-for="(breadcrumb, i) in breadcrumbs" :key="i">
        <el-breadcrumb-item :to="breadcrumb.to">{{ breadcrumb.text }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
    <router-view :class="{ 'sm:max-w-900px mx-auto': minWindow }" />
  </main>
</template>

<style scoped lang="scss">
main {
  grid-area: main;
}
</style>
