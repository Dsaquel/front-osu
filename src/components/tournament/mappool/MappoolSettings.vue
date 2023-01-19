<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Setting } from '@element-plus/icons-vue';
import { Tournament, TournamentMappool, QualifierMappool } from '~/types';

dayjs.extend(utc);

const { updateTournamentMappool, deleteTournamentMappool } = mappoolStore();

const props = defineProps<{
  mappool: TournamentMappool | QualifierMappool;
  tournament: Tournament;
}>();

const showDialog = ref(false);
let isVisibleLoading = $ref(false);

function deleteMappool(mappoolId: number) {
  deleteTournamentMappool(props.tournament.id, mappoolId);
}

async function updateDate(displayMappoolsSchedule: string, mappoolId: number) {
  await updateTournamentMappool(props.tournament.id, mappoolId, { displayMappoolsSchedule });
}

async function updateVisibility(isVisible: boolean, mappoolId: number) {
  isVisibleLoading = true;
  await updateTournamentMappool(props.tournament.id, mappoolId, { isVisible });
  isVisibleLoading = false;
}
</script>

<template>
  <el-button type="primary" :icon="Setting" @click="showDialog" />

  <el-dialog v-model="showDialog">
    <CommonDatepicker
      :model-value="mappool.displayMappoolsSchedule"
      :title="'Date where the mappool can be public'"
      :type="'datetime'"
      @update:model-value="(val) => (mappool.displayMappoolsSchedule = dayjs(val).utc().format())"
      @change="(val: string) => updateDate(dayjs(val).utc().format(), mappool.id)"
    />
    <el-switch
      v-model="mappool.isVisible"
      :loading="isVisibleLoading"
      @update:model-value="(val: boolean) => updateVisibility(val, mappool.id)"
    />
    <el-button type="danger" plain @click="deleteMappool(mappool.id)">Delete</el-button>
  </el-dialog>
</template>
