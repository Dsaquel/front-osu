<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
const { fetchTournamentMappools, fetchQualifierMappool } = mappoolStore();
const { fetchTournament, fetchControlAccess } = tournamentStore();
const { qualifierMappool, tournamentMappools } = storeToRefs(mappoolStore());
const { isAuthorized, access, tournament } = storeToRefs(tournamentStore());

const activeCollapse = ref(['1']);

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);

async function init() {
  await fetchTournament(tournamentId);
  await fetchControlAccess(tournamentId);
  await fetchTournamentMappools(tournamentId);
  if (tournament.value?.qualifier) await fetchQualifierMappool(tournament.value.qualifier.id);
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});

watch([tournamentMappools, qualifierMappool], () => {
  const thImages = document.getElementsByClassName('image-label');
  Array.from(thImages).forEach((element) => {
    element.setAttribute('rowspan', '2');
  });
});
</script>

<template>
  <Transition>
    <el-card v-if="!initLoading" shadow="never">
      <div v-if="tournament" m="t-2">
        <div display="flex" align="items-center" justify="between" m="b-6">
          <h2 m="x-auto" text="xl">Tournament mappools</h2>
          <MappoolCreate
            v-if="isAuthorized && (access?.isAdmin || access?.isOwner || access?.isMappooler)"
            align="self-end"
            :tournament="tournament"
          />
        </div>
        <el-collapse v-if="tournamentMappools" v-model="activeCollapse">
          <el-collapse-item v-for="(tournamentMappool, i) in tournamentMappools" :key="i" :name="tournamentMappool.id">
            <template #title>
              <div display="flex" align="items-center" justify="between" w="full">
                <span text="lg">{{ `Round ${tournamentMappool.round}` }}</span>
                <div>
                  <MappoolSettings
                    v-if="isAuthorized && (access?.isAdmin || access?.isOwner || access?.isMappooler)"
                    m="x-2"
                    :tournament="tournament"
                    :mappool="tournamentMappool"
                  />
                </div>
              </div>
            </template>

            <MappoolTable :mappool="tournamentMappool" />
            <MapCreate
              v-if="isAuthorized && (access?.isAdmin || access?.isOwner || access?.isMappooler)"
              m="t-4"
              :tournament-mappool="tournamentMappool"
            />
          </el-collapse-item>
          <el-collapse-item v-if="qualifierMappool">
            <template #title>
              <div display="flex" align="items-center" justify="between" w="full">
                <span text="lg">Qualifier</span>
                <div>
                  <MappoolSettings
                    v-if="isAuthorized && (access?.isAdmin || access?.isOwner || access?.isMappooler)"
                    m="x-2"
                    :qualifier="tournament.qualifier"
                    :mappool="qualifierMappool"
                  />
                </div>
              </div>
            </template>

            <MappoolTable :mappool="qualifierMappool" />
            <MapCreate
              v-if="isAuthorized && (access?.isAdmin || access?.isOwner || access?.isMappooler)"
              m="t-4"
              :qualifier-mappool="qualifierMappool"
            />
          </el-collapse-item>
        </el-collapse>
      </div>

      <el-empty v-else />
    </el-card>
    <div v-else v-loading.fullscreen.lock="initLoading" />
  </Transition>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
