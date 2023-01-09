<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Tournament } from '~/types';
import topToBottom from '~/assets/svg/branches/topToBottom.svg';
import bottomToTop from '~/assets/svg/branches/bottomToTop.svg';
import middle from '~/assets/svg/branches/middle.svg';

const { fetchMatches } = matchStore();
const { matches } = storeToRefs(matchStore());
const props = defineProps<{
  tournament: Tournament;
}>();

onBeforeMount(async () => {
  await fetchMatches(props.tournament.id);
});
</script>
<template>
  <div v-if="tournament.numbersPlayers" m="b-4" p="4">
    <div pos="relative">
      <BracketMatch style="position: absolute; left: 0; top: 0; width: 180px; color: #031221" />
      <topToBottom style="position: absolute; left: 180px; top: 0" />
      <BracketMatch style="position: absolute; left: 0; top: 66px; width: 180px; color: #031221" />
      <bottomToTop style="position: absolute; left: 180px; top: 32px" />
    </div>
  </div>
  <div v-else>Need numbers players for getting preview</div>
</template>
