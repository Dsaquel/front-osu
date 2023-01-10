<script setup lang="ts">
import { Match } from '~/types';

defineProps<{
  lowerBracketMatches?: Match;
}>;
</script>

<template>
  <div class="tournament-bracket tournament-bracket--rounded">
    <div v-for="(matchesLower, i) in lowerBracketMatches" :key="i" class="tournament-bracket__round">
      <h3 class="tournament-bracket__round-title">les nuls</h3>
      <ul class="tournament-bracket__list">
        <li v-for="(match, z) in matchesLower" :key="z" class="tournament-bracket__item">
          <BracketMatch :match="match" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
//
</style>
