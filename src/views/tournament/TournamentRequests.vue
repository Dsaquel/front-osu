<script lang="ts" setup>
const { fetchTournament, fetchControlAccess } = tournamentStore();
const { tournament, isAuthorized, access, staffRequests } = storeToRefs(tournamentStore());

const router = useRouter();

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

async function init() {
  fetchControlAccess(tournamentId);
  fetchTournament(tournamentId);
}

onBeforeMount(async () => {
  init();
});

const goBack = () => {
  router.push({
    name: 'home',
  });
};
</script>

<template>
  <el-empty v-if="!isAuthorized || (!access?.isAdmin && !access?.isOwner)">
    <template #description>Only admins have access to this page</template>
  </el-empty>
  <div v-else-if="tournament" grid="~ cols-5">
    <div grid="col-span-4" place="self-center"></div>
    <TournamentStaff :tournament-id="tournament.id" />
  </div>
  <el-empty v-else>
    <template #description>
      <div display="block" m="b-2">I dont have this tournament sorry</div>
      <el-button type="primary" @click="goBack">Back</el-button>
    </template>
  </el-empty>
</template>
