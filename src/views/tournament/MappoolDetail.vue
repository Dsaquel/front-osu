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
  <div v-if="tournament" class="card" p="4">
    <div text="xl center">
      {{ tournament.name }}
    </div>
    <div>start create a mappool</div>
  </div>
</template>
