<script setup lang="ts">
import router from '~/router';
import { isParticipantIndividual } from '~/types';

const { fetchTournament, fetchControlAccess, fetchParticipants } = tournamentStore();
const { tournament, participantsAccepted } = storeToRefs(tournamentStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);

async function init() {
  try {
    await fetchControlAccess(tournamentId);
    await fetchTournament(tournamentId);
    await fetchParticipants(tournamentId);
  } catch (e) {
    console.log('init error', e);
  }
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});

const goBack = () => {
  router.push({
    name: 'home',
  });
};
</script>

<template>
  <div v-if="!initLoading" class="sm:max-w-900px mx-auto">
    <div v-if="tournament && participantsAccepted">
      <ParticipantIndividualTable
        v-if="isParticipantIndividual(participantsAccepted)"
        :participants-individuals="participantsAccepted"
      />
      <ParticipantTeamTable v-else :participants-teams="participantsAccepted" />
    </div>
    <el-empty v-else>
      <template #description>
        <div display="block" m="b-2">I dont have this tournament sorry</div>
        <el-button type="primary" @click="goBack">Back</el-button>
      </template>
    </el-empty>
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
