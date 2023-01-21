<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Qualifier, Tournament } from '~/types';

const { fetchTournamentMappools, fetchQualifierMappool } = mappoolStore();
const { qualifierMappool, tournamentMappools } = storeToRefs(mappoolStore());
const { isAuthorized, access } = storeToRefs(tournamentStore());

const props = defineProps<{
  tournament: Tournament;
  qualifier: Qualifier | null;
}>();

const activeCollapse = ref(['1']);

onBeforeMount(async () => {
  await fetchTournamentMappools(props.tournament.id);
  if (props.tournament.qualifier) await fetchQualifierMappool(props.tournament.qualifier.id);
});

watch([tournamentMappools, qualifierMappool], () => {
  const thImages = document.getElementsByClassName('image-label');
  Array.from(thImages).forEach((element) => {
    element.setAttribute('rowspan', '2');
  });
});
</script>

<template>
  <div class="card" m="t-2" p="4">
    <div display="flex" align="items-center" justify="between" m="b-6">
      <h2 m="x-auto" text="xl">Tournament mappools</h2>
      <MappoolCreate
        v-if="isAuthorized && (access?.isHost || access?.isOwner || access?.isMappooler)"
        align="self-end"
        :tournament="tournament"
      />
    </div>
    <div>
      <el-collapse v-if="tournamentMappools" v-model="activeCollapse">
        <el-collapse-item v-for="(tournamentMappool, i) in tournamentMappools" :key="i" :name="tournamentMappool.id">
          <template #title>
            <div display="flex" align="items-center" justify="between" w="full">
              <span text="lg">{{ `Round ${tournamentMappool.round}` }}</span>
              <div>
                <MappoolSettings
                  v-if="isAuthorized && (access?.isHost || access?.isOwner || access?.isMappooler)"
                  m="x-2"
                  :tournament="tournament"
                  :mappool="tournamentMappool"
                />
              </div>
            </div>
          </template>

          <MappoolTable :mappool="tournamentMappool" />
          <MapCreate
            v-if="isAuthorized && (access?.isHost || access?.isOwner || access?.isMappooler)"
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
                  v-if="isAuthorized && (access?.isHost || access?.isOwner || access?.isMappooler)"
                  m="x-2"
                  :qualifier="qualifier"
                  :mappool="qualifierMappool"
                />
              </div>
            </div>
          </template>

          <MappoolTable :mappool="qualifierMappool" />
          <MapCreate
            v-if="isAuthorized && (access?.isHost || access?.isOwner || access?.isMappooler)"
            m="t-4"
            :qualifier-mappool="qualifierMappool"
          />
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
