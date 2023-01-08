<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Tournament } from '~/types';

const { fetchMatches } = matchStore();
const props = defineProps<{
  tournament: Tournament;
}>();

onBeforeMount(async () => {
  await fetchMatches(props.tournament.id);
});
</script>
<template>
  <div v-if="tournament.numbersPlayers" class="card" m="b-4" p="4">preview desu de {{ tournament.name }}</div>
  <div v-else>Need numbers players for getting preview</div>
</template>
