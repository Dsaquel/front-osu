<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import router from '~/router';

const { fetchQualifier } = qualifierStore();
const { fetchTournament, fetchControlAccess, updatePublication } = tournamentStore();
const { qualifier } = storeToRefs(qualifierStore());
const { tournament, isAuthorized } = storeToRefs(tournamentStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);

async function init() {
  await fetchQualifier(tournamentId);
  await fetchControlAccess(tournamentId);
  await fetchTournament(tournamentId);
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});

function passTournamentPublic() {
  updatePublication(tournamentId);
}

const goLobbies = () => {
  router.push({ name: 'qualifier-lobbies', params: { tournamentId } });
};
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
      <el-button v-if="!tournament.isPublic" type="success" @click="passTournamentPublic">pass to public</el-button>
      <el-button link @click="goLobbies">
        <router-link :to="{}">see lobbies</router-link>
      </el-button>
    </div>
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
