<script lang="ts" setup>
const { fetchStaff, fetchTournament, fetchControlAccess } = tournamentStore();
const { tournament, isAuthorized, access } = storeToRefs(tournamentStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

async function init() {
  fetchControlAccess(tournamentId);
  fetchTournament(tournamentId);
  fetchStaff(tournamentId);
}

onBeforeMount(async () => {
  init();
});
</script>

<template>
  <div v-if="tournament" grid="~ cols-5">
    <el-empty v-if="!isAuthorized && (access?.isAdmin || access?.isOwner)">
      <template #description>Only admins have access to this page</template>
    </el-empty>
  </div>
</template>
