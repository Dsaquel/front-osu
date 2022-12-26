<script setup lang="ts">
import useTournamentStore from '../../store/tournament.store';

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
const { fetch } = useTournamentStore();
const { tournament } = storeToRefs(useTournamentStore());

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
