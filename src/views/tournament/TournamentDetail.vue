<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
const router = useRouter();
const { fetchTournament, fetchControlAccess } = tournamentStore();
const { tournament, isAuthorized } = storeToRefs(tournamentStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

let tournamentLoading = $ref(false);

async function init() {
  if (!tournamentId) return;
  await fetchTournament(tournamentId);
  await fetchControlAccess(tournamentId);
}

onMounted(async () => {
  tournamentLoading = true;
  await init();
  tournamentLoading = false;
});

const goBack = () => {
  router.push({
    name: 'home',
  });
};

function participate() {
  // player participant
}

const goRequests = () => {
  router.push({
    name: 'tournament-requests',
    params: { tournamentId },
  });
};
</script>

<template>
  <div v-if="tournament" grid="~ cols-5">
    <el-empty v-if="!tournament.isPublic && !isAuthorized" v-loading="tournamentLoading">
      <template v-if="!tournamentLoading" #description>You dont have access to this tournament</template>
    </el-empty>
    <div v-else grid="col-span-4">
      <div class="container" display="grid" grid="row-start-2" v-bind="useAttrs()">
        <el-alert
          v-if="!tournament.isPublic"
          title="tournament not yet public"
          type="info"
          show-icon
          pos="absolute inset-0"
        />
        <el-descriptions border direction="horizontal" :column="1" m="t-4">
          <template #title>
            <span text="xl">{{ tournament.name }}</span></template
          >
          <template #extra>
            <router-link :to="{ name: 'mappool-manager', params: { tournamentId: tournament.id } }">
              <el-button link>mappool</el-button>
            </router-link>
            <router-link m="l-2" :to="{ name: 'tournament-bracket', params: { tournamentId: tournament.id } }">
              <el-button link>bracket</el-button>
            </router-link>
            <router-link
              v-if="isAuthorized"
              :to="{ name: 'tournament-update', params: { tournamentId: tournament.id } }"
              m="l-2"
            >
              <el-button type="primary" plain round><i-material-symbols:edit /> </el-button>
            </router-link>
          </template>
          <el-descriptions-item label="type">{{ `osu ${tournament.type}` }}</el-descriptions-item>
          <el-descriptions-item label="accept rank">{{
            (tournament.rangePlayerMin === 1 || !tournament.rangePlayerMin) && !tournament.rangePlayerMax
              ? 'Open rank'
              : `${tournament.rangePlayerMin} to ${tournament.rangePlayerMax || '+&#8734;'}`
          }}</el-descriptions-item>
          <el-descriptions-item label="end registration">{{ tournament.endRegistration }}</el-descriptions-item>
          <el-descriptions-item label="start date">{{ tournament.startDate }}</el-descriptions-item>
          <el-descriptions-item label="number player">{{ tournament.numbersPlayers }}</el-descriptions-item>
          <el-descriptions-item label="has qualifier">{{ tournament.qualifier ? 'yes' : 'no' }}</el-descriptions-item>
        </el-descriptions>

        <div>
          <span display="inline-block">Description</span>
          <MarkdownRender :text="tournament.description" />
        </div>
        <el-button v-if="isAuthorized" type="success" m="t-4" place="self-end" @click="participate">
          participate
        </el-button>
      </div>
    </div>
    <TournamentStaff :tournament-id="tournament.id">
      <template #goRequests>
        <el-button @click="goRequests">see requestes</el-button>
      </template>
    </TournamentStaff>
  </div>
  <el-empty v-else>
    <template #description>
      <div display="block" m="b-2">I dont have this tournament sorry</div>
      <el-button type="primary" @click="goBack">Back</el-button>
    </template>
  </el-empty>
</template>
