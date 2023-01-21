<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
const { fetchMatches } = matchStore();
const { matchesGrouped } = storeToRefs(matchStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

onBeforeMount(() => {
  fetchMatches(tournamentId);
});
</script>
<template>
  <div v-if="matchesGrouped">
    <UpperBracket :upper-bracket-matches="matchesGrouped.upper" />
    <div h="100px"></div>
    <LowerBracket :lower-bracket-matches="matchesGrouped.lower" />
  </div>
</template>

<style lang="scss" scoped>
//
</style>
