<script setup lang="ts">
const { fetchQualifier } = qualifierStore();
const { fetchTournament, fetchControlAccess } = tournamentStore();
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

watch(
  () => tournamentId,
  () => init(),
);
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
    </div>
    <el-empty v-else />
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
