<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
const { fetchQualifier } = qualifierStore();
const { fetchTournament } = tournamentStore();
const { qualifier } = storeToRefs(qualifierStore());
const { tournament } = storeToRefs(tournamentStore());

async function init() {
  if (!tournamentId) return;
  fetchQualifier(tournamentId);
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
  <div v-if="qualifier && tournament">
    <el-alert
      v-if="!tournament.isPublic"
      title="Qualifier not  public yet"
      type="info"
      show-icon
      pos="absolute inset-0"
      m="b-3"
    />
    <div class="container" display="grid" grid="row-start-2" v-bind="useAttrs()">
      <div text="xl">For tournament: {{ tournament.name }}</div>
      <div>Is mappool qualifier watchable: {{ qualifier.mappool || 'no set yet' }}</div>
      <div>show mappool to participant schedule: {{ qualifier.lobbies || 'no set yet' }}</div>
    </div>
  </div>
  <div v-else>nothing to show</div>
</template>
