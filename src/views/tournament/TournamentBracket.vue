<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
const { fetchMatches } = matchStore();
const { fetchControlAccess, fetchTournament, fetchPlayer } = tournamentStore();
const { tournament, winner } = storeToRefs(tournamentStore());
const { matchesGrouped } = storeToRefs(matchStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);

async function init() {
  try {
    await fetchMatches(tournamentId);
    await fetchControlAccess(tournamentId);
    await fetchTournament(tournamentId);
    if (tournament.value?.winnerId) {
      await fetchPlayer(tournament.value?.winnerId, tournamentId);
    }
  } catch (e) {
    console.log('init error', e);
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
    <el-card v-if="tournament?.winnerId && winner" flex="~ col" align="items-center" shadow="never" m="b-4">
      <template #header>Winner</template>
      <div v-if="'user' in winner" flex="~" align="items-center">
        <el-avatar :src="winner?.user.avatarUrl" />
        <div text="lg orange-500" m="l-3">{{ winner.user.username }}</div>
      </div>
      <div v-else>
        <div display="flex" justify="center" class="whitespace-nowrap" w="full">
          <template v-for="user in winner.users" :key="user.id">
            <el-tooltip :content="user.username">
              <el-avatar class="float-left ml-[-10px]" :src="user.avatarUrl" />
            </el-tooltip>
          </template>
        </div>
        <div text="lg orange-500" m="l-3">{{ winner.name }}</div>
      </div>
    </el-card>
    <div
      v-if="matchesGrouped"
      ref="el"
      pos="sticky"
      :style="{
        cursor: isDragging ? 'grabbing' : 'grab',
        'scroll-snap-type': isDragging ? '' : '',
      }"
      overflow="auto"
      p="5px"
      bg=" dark-700"
      border="1 gray-600 opacity-40"
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
