<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Match, Tournament } from '~/types';

const { fetchMatches } = matchStore();
const { matches, matchesGrouped } = storeToRefs(matchStore());
const props = defineProps<{
  tournament: Tournament;
}>();

onBeforeMount(async () => {
  await fetchMatches(props.tournament.id);
});

watch(matchesGrouped, () => {
  console.log(matchesGrouped?.value);
});
</script>
<template>
  <div v-if="matchesGrouped" class="container">
    <UpperBracket :upperBracketMatches="matchesGrouped.upper" />
    <LowerBracket :lowerBracketMatches="matchesGrouped.lower" />
  </div>
</template>

<style lang="scss" scoped>
//
</style>
