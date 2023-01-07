<script setup lang="ts">
const { fetchTournament } = tournamentStore();
const { tournament } = storeToRefs(tournamentStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

async function init() {
  if (!tournamentId) return;
  fetchTournament(tournamentId);
}

onMounted(() => {
  init();
});
</script>
<template>
  <div v-if="tournament">
    <div text="xl center">
      {{ tournament.name }}
    </div>
    <div h="500"></div>
    <h2 id="qualifier">Qualifier desu</h2>
    <div h="500"></div>
  </div>
</template>
