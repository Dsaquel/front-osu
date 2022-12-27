<script setup lang="ts">

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
const { fetch } = tournamentStore();
const { tournament } = storeToRefs(tournamentStore());

async function init() {
  if (!tournamentId) return;
  fetch(tournamentId);
}

onMounted(() => {
  init();
});

watch(
  () => tournamentId,
  () => init(),
);
</script>

<template>mon name est : {{ tournament?.name }}</template>
