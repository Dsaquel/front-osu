<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ParticipantIndividual, ParticipantTeam } from '~/types';

const { fetchQualifier, fetchMapsScore, fetchParticipantsRanking, passQualifierToFinished } = qualifierStore();
const { fetchTournament, fetchControlAccess } = tournamentStore();
const { qualifier, mapsScore, participantsRanking } = storeToRefs(qualifierStore());
const { tournament, isAuthorized, isOwnerOrAdmin } = storeToRefs(tournamentStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);

async function init() {
  try {
    await fetchQualifier(tournamentId);
    await fetchControlAccess(tournamentId);
    await fetchTournament(tournamentId);
    await fetchMapsScore(qualifier.value?.id as number);
    await fetchParticipantsRanking(qualifier.value?.id as number);
  } catch (e) {
    console.log('init error', e);
  }
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});

function calculMedian(numbers: number[]) {
  numbers.sort((a, b) => a - b);
  let median: number;

  if (numbers.length % 2 === 0) {
    median = (numbers[numbers.length / 2 - 1] + numbers[numbers.length / 2]) / 2;
  } else {
    median = numbers[Math.floor(numbers.length / 2)];
  }

  return median;
}
</script>

<template>
  <div v-if="!initLoading">
    <div v-if="qualifier && tournament">
      <el-empty v-if="!tournament.isPublic && !isAuthorized" place="self-center" justify="self-center">
        <template #description>
          <div text="xl">You dont have access to this qualifier</div>
        </template>
      </el-empty>
      <el-alert
        v-if="!tournament.isPublic"
        title="Qualifier not public yet"
        type="info"
        show-icon
        pos="absolute inset-0"
        m="b-3"
      />

      <div v-if="participantsRanking" flex="~ wrap" grid="gap-5" justify="center">
        <div class="lg:basis-4/5 md:basis-full">
          <el-descriptions border direction="vertical" :column="4">
            <template #extra>
              <router-link :to="{ name: 'qualifier-lobbies', params: { tournamentId } }">
                <el-button link>lobbies</el-button>
              </router-link>
              <el-button
                v-if="isOwnerOrAdmin && !tournament.isInBracketPhase"
                m="l-2"
                type="success"
                size="small"
                @click="passQualifierToFinished(qualifier?.id as number, tournament?.id as number)"
                >pass qualifier to finished
              </el-button>
            </template>
            <el-descriptions-item label="average total score" min-width="min-content">
              {{
                participantsRanking
                  .map((participant) => participant.qualifierParticipant?.totalScore || 0)
                  .reduce((p, c) => p + c, 0) / participantsRanking.length || 'no score set yet'
              }}
            </el-descriptions-item>
            <el-descriptions-item label="average total points">
              {{
                participantsRanking
                  .map((participant) => participant.qualifierParticipant?.totalRank || 0)
                  .reduce((p, c) => p + c, 0) / participantsRanking.length || 'no score set yet'
              }}
            </el-descriptions-item>
            <el-descriptions-item label="total score median">
              {{
                calculMedian(
                  participantsRanking.map((participant) => participant.qualifierParticipant?.totalScore || 0),
                ) || 'no score set yet'
              }}
            </el-descriptions-item>
            <el-descriptions-item label="median of total points">
              {{
                calculMedian(
                  participantsRanking.map((participant) => participant.qualifierParticipant?.totalRank || 0),
                ) || 'no score set yet'
              }}
            </el-descriptions-item>
          </el-descriptions>

          <el-table :data="participantsRanking">
            <el-table-column label="players">
              <template #default="scope: { row: ParticipantIndividual | ParticipantTeam }">
                <div v-if="'user' in scope.row" display="flex" align="items-center">
                  <el-avatar :src="scope.row.user.avatarUrl" />
                  <span m="l-2" text="overflow-ellipsis space-nowrap" overflow="hidden">
                    {{ scope.row.user.username }}
                  </span>
                </div>
                <div v-else>
                  {{ scope.row.name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="total score">
              <template #default="scope: { row: ParticipantIndividual | ParticipantTeam }">
                {{ scope.row.qualifierParticipant?.totalScore?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="points">
              <template #default="scope: { row: ParticipantIndividual | ParticipantTeam }">
                {{ scope.row.qualifierParticipant?.totalRank || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="seed">
              <template #default="scope: { row: ParticipantIndividual | ParticipantTeam }">
                {{ scope.row.qualifierParticipant?.seed }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <template v-for="mapScore in mapsScore" :key="mapScore.id">
          <MapScoreTable :map-score="mapScore" class="lg:basis-2/7 md:basis-4/5" />
        </template>
      </div>
    </div>
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
