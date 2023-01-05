<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
const { fetchTournament } = tournamentStore();
const { tournament } = storeToRefs(tournamentStore());

async function init() {
  if (!tournamentId) return;
  fetchTournament(tournamentId);
}

onMounted(() => {
  init();
});

watch(
  () => tournamentId,
  () => init(),
);
</script>

<template>
  <div v-if="tournament">
    <el-alert
      v-if="!tournament.isPublic"
      title="tournament not yet public"
      type="info"
      show-icon
      pos="absolute inset-0"
      m="b-3"
    />
    <div class="container" display="grid" grid="row-start-2" v-bind="useAttrs()">
      <div>Tournament name: {{ tournament.name }}</div>
      <div>
        <span display="inline-block">Description</span>
        <MarkdownRender :text="tournament.description" />
      </div>
      <div>End registration: {{ tournament.endRegistration || 'no set yet' }}</div>
      <div>range: {{ tournament.rangePlayerMin || 1 }} to {{ tournament.rangePlayerMax || '+&#8734;' }}</div>
      <div>type: {{ tournament.type }}</div>
      <div>start date: {{ tournament.startDate || 'no set yet' }}</div>
      <div>numbers player: {{ tournament.numbersPlayers }}</div>
      <router-link :to="{ name: 'tournament-update', params: { tournamentId: tournament.id } }">
        <el-button>edit the tournament</el-button>
      </router-link>
    </div>
  </div>
</template>
