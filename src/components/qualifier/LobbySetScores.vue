<script setup lang="ts">
const { qualifier } = storeToRefs(qualifierStore());
const { updateScoresLobby } = qualifierStore();
const { access, isOwnerOrAdmin } = storeToRefs(tournamentStore());

const showSetScores = ref(false);
let setScoresLoading = $ref(false);

const lobbyInput = ref<string>('');
async function searchLobby() {
  try {
    setScoresLoading = true;
    new URL(lobbyInput.value);
    if (new URL(lobbyInput.value).origin !== 'https://osu.ppy.sh') return;
    const matchId = lobbyInput.value.split('/')[lobbyInput.value.split('/').length - 1];
    await updateScoresLobby(+matchId, qualifier.value?.id as number);
    ElMessage.success({ message: 'scores updated !', duration: 1000 });
  } catch (e) {
    ElMessage.error({ message: 'i need an osu url !', duration: 2000 });
    console.log(e);
  } finally {
    setScoresLoading = false;
    showSetScores.value = false;
  }
}
</script>

<template>
  <div v-if="qualifier && (isOwnerOrAdmin || access?.isReferee)">
    <el-button m="l-1" type="primary" @click="showSetScores = true">set scores</el-button>

    <el-dialog v-model="showSetScores" v-bind="useAttrs()" w="5/10 min-[600px]" class="<sm:min-w-full" append-to-body>
      <div display="grid" grid="cols-1" justify="items-center">
        <el-input v-model="lobbyInput" placeholder="https://osu.ppy.sh/community/matches/90488075" size="large" />
      </div>
      <template #footer>
        <span>
          <el-button @click="showSetScores = false">Cancel</el-button>
          <el-button :loading="setScoresLoading" type="primary" :disabled="!lobbyInput" @click="searchLobby">
            set news scores
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
