<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
const { fetchMatches } = matchStore();
const { fetchControlAccess, fetchTournament } = tournamentStore();
const { matchesGrouped } = storeToRefs(matchStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);

async function init() {
  if (!tournamentId) return;
  await fetchMatches(tournamentId);
  await fetchControlAccess(tournamentId);
  await fetchTournament(tournamentId);
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});
</script>
<template>
  <div v-if="!initLoading">
    <div v-if="matchesGrouped">
      <UpperBracket :upper-bracket-matches="matchesGrouped.upper" />
      <div h="100px"></div>
      <LowerBracket :lower-bracket-matches="matchesGrouped.lower" />
    </div>
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>

<style lang="scss" scoped>
//
</style>
