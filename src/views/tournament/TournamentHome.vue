<script setup lang="ts">
const { fetchTournaments } = tournamentStore();

const initLoading = ref(false);

async function init() {
  try {
    await fetchTournaments();
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
    <TournamentHomeTable />
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
