<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
const { fetchMatches } = matchStore();
const { fetchControlAccess, fetchTournament, fetchPlayer } = tournamentStore();
const { tournament } = storeToRefs(tournamentStore());
const { matchesGrouped } = storeToRefs(matchStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);

async function init() {
  if (!tournamentId) return;
  await fetchMatches(tournamentId);
  await fetchControlAccess(tournamentId);
  await fetchTournament(tournamentId);
  if (tournament.value?.winnerId) {
    await fetchPlayer(tournament.value.winnerId, tournamentId);
  }
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});

const isDragging = ref(false);
const cursorPos = ref([0, 0]);
const el = ref<HTMLDivElement | null>(null);

function onMouseHold(ev: MouseEvent) {
  ev.preventDefault();
  requestAnimationFrame(() => {
    const delta = [ev.pageX - cursorPos.value[0], ev.pageY - cursorPos.value[1]];
    cursorPos.value = [ev.pageX, ev.pageY];
    if (!el.value) return;
    el.value.scrollBy({
      left: -delta[0],
      top: -delta[1],
    });
  });
}

function onMouseUp() {
  window.removeEventListener('mousemove', onMouseHold);
  isDragging.value = false;
}

function onMouseDown(ev: MouseEvent) {
  cursorPos.value = [ev.pageX, ev.pageY];
  isDragging.value = true;

  window.addEventListener('mousemove', onMouseHold);
}

onMounted(() => {
  window.addEventListener('mouseup', onMouseUp);
});

onDeactivated(() => {
  window.removeEventListener('mouseup', onMouseUp);
});
</script>
<template>
  <div v-if="!initLoading">
    <div
      v-if="matchesGrouped"
      ref="el"
      :style="{
        cursor: isDragging ? 'grabbing' : 'grab',
        'scroll-snap-type': isDragging ? '' : '',
      }"
      overflow="auto"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    >
      <UpperBracket :upper-bracket-matches="matchesGrouped.upper" />
      <div h="100px"></div>
      <LowerBracket :lower-bracket-matches="matchesGrouped.lower" />
    </div>
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
