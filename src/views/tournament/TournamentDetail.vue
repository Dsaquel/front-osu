<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
const router = useRouter();
const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
const { fetchTournament, controlAccess } = tournamentStore();
const { tournament, isAuthorized } = storeToRefs(tournamentStore());

let tournamentLoading = $ref(false);

async function init() {
  if (!tournamentId) return;
  await fetchTournament(tournamentId);
  await controlAccess(tournamentId);
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
</script>

<template>
  <div v-if="tournament">
    <el-empty v-if="!tournament.isPublic && !isAuthorized" v-loading="tournamentLoading">
      <template v-if="!tournamentLoading" #description>You dont have access to this tournament</template>
    </el-empty>
    <div v-else>
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
        <router-link v-if="isAuthorized" :to="{ name: 'tournament-update', params: { tournamentId: tournament.id } }">
          <el-button>edit the tournament</el-button>
        </router-link>
      </div>
    </div>
  </div>
  <el-empty v-else>
    <template #description>
      <div display="block" m="b-2">I dont have this tournament sorry</div>
      <el-button type="primary" @click="goBack">Back</el-button>
    </template>
  </el-empty>
</template>
