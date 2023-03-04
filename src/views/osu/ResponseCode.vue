<template><div v-loading.fullscreen.lock="initLoading" /></template>

<script setup lang="ts">
import router from '~/router';

const initLoading = ref(false);

async function init() {
  const code = useRoute().query.code as string;
  await authStore().siginIn(code);
}

onBeforeMount(async () => {
  try {
    initLoading.value = true;
    await init();
    await userStore().fetch();
  } catch (e) {
    //
  } finally {
    initLoading.value = false;
    router.replace({ name: 'home' });
  }
});
</script>
