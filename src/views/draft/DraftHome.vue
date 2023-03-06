<script setup lang="ts">
const { fetchDrafts } = draftStore();

const initLoading = ref(false);

async function init() {
  try {
    await fetchDrafts();
  } catch (e) {
    console.log('init error', e);
  }
}

onBeforeMount(async () => {
  initLoading.value = true;
  await init();
  initLoading.value = false;
});
</script>

<template>
  <div v-if="!initLoading">
    <DraftHomeTable />
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
