<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Tournament } from '~/types';

const { fetchMatches } = matchStore();
const { matchesGrouped } = storeToRefs(matchStore());
const props = defineProps<{
  tournament: Tournament;
}>();

onBeforeMount(async () => {
  await fetchMatches(props.tournament.id);
});
</script>
<template>
  <div v-if="matchesGrouped">
    <slot name="mappoolers" />
    <!-- <UpperBracket :upper-bracket-matches="matchesGrouped.upper" />
    <div h="100px"></div>
    <LowerBracket :lower-bracket-matches="matchesGrouped.lower" /> -->
  </div>
</template>

<style lang="scss" scoped>
//
</style>
