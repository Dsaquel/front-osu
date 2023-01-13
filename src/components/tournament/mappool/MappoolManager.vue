<script setup lang="ts">
import { onBeforeMount } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
// import { Minus, Plus } from '@element-plus/icons-vue';
import { Tournament } from '~/types';

dayjs.extend(utc);

const { fetchTournamentMappools, fetchQualifierMappool, updateTournamentMappool, deleteTournamentMappool } =
  mappoolStore();
const { qualifierMappool, tournamentMappools } = storeToRefs(mappoolStore());

const activeCollapse: number[] = [];

const props = defineProps<{
  tournament: Tournament;
}>();

onBeforeMount(async () => {
  await fetchTournamentMappools(props.tournament.id);
  if (props.tournament.qualifier) await fetchQualifierMappool(props.tournament.qualifier.id);
});

function mappoolUpdate(mappoolId: number) {
  updateTournamentMappool(props.tournament.id, mappoolId, {
    displayMappoolsSchedule: tournamentMappools.value?.find((t) => t.id === mappoolId)?.displayMappoolsSchedule,
    isVisible: tournamentMappools.value?.find((t) => t.id === mappoolId)?.isVisible,
  });
}

function deleteMappool(mappoolId: number) {
  deleteTournamentMappool(props.tournament.id, mappoolId);
}
</script>

<template>
  <div class="card" m="t-2" p="4">
    <h2 text="center xl">Tournament mappools</h2>
    <div>
      <MappoolCreate :tournament="tournament" />

      <el-collapse v-model="activeCollapse">
        <el-collapse-item
          v-for="(tournamentMappool, i) in tournamentMappools"
          :key="i"
          :title="`Round ${tournamentMappool.round}`"
          :name="tournamentMappool.id"
        >
          <MapCreate :tournament-mappool="tournamentMappool" />
          <CommonDatepicker
            :model-value="tournamentMappool.displayMappoolsSchedule"
            :title="'Date where the mappool can be public'"
            :type="'datetime'"
            @update:model-value="(val) => (tournamentMappool.displayMappoolsSchedule = dayjs(val).utc().format())"
          />
          <div>
            <!-- <el-button type="danger" :icon="Minus" plain /> -->
          </div>
          <el-button type="primary" @click="mappoolUpdate(tournamentMappool.id)">Save change</el-button>
          <el-button type="danger" plain @click="deleteMappool(tournamentMappool.id)">Delete</el-button>
        </el-collapse-item>
        <el-collapse-item v-if="qualifierMappool" title="Qualifier mappool">
          {{ qualifierMappool.isVisible }}
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
