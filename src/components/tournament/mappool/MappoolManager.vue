<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Tournament } from '~/types';

const { fetchTournamentMappools, fetchQualifierMappool } = mappoolStore();

const { qualifierMappool, tournamentMappools } = storeToRefs(mappoolStore());

const props = defineProps<{
  tournament: Tournament;
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
    <h2 text="center xl">Tournament mappools</h2>
    <div>
      <MappoolCreate :tournament="tournament" />

      <el-collapse v-model="activeCollapse">
        <el-collapse-item v-for="(tournamentMappool, i) in tournamentMappools" :key="i" :name="tournamentMappool.id">
          <template #title>
            <div display="flex"></div>
            {{ `Round ${tournamentMappool.round}` }}<MapCreate :tournament-mappool="tournamentMappool" />
            <MappoolSettings />
          </template>

          <MappoolTable :mappool="tournamentMappool" />
        </el-collapse-item>
        <el-collapse-item v-if="qualifierMappool" title="Qualifier mappool">
          {{ qualifierMappool.isVisible }}
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
