<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Setting } from '@element-plus/icons-vue';
import { Tournament, TournamentMappool, QualifierMappool, Qualifier } from '~/types';

dayjs.extend(utc);

const { updateTournamentMappool, deleteTournamentMappool, updateQualifierMappool } = mappoolStore();

const props = defineProps<{
  mappool: TournamentMappool | QualifierMappool;
  tournament?: Tournament;
  qualifier?: Qualifier;
}>();

const showDialog = ref(false);
let isVisibleLoading = $ref(false);

const mappoolSchedule = ref(props.mappool.displayMappoolsSchedule);

function deleteMappool(mappoolId: number) {
  if (props.tournament) deleteTournamentMappool(props.tournament.id, mappoolId);
}

async function updateVisibility(isVisible: boolean, mappoolId: number) {
  if (props.tournament) {
    isVisibleLoading = true;
    await updateTournamentMappool(props.tournament.id, mappoolId, { isVisible });
    isVisibleLoading = false;
  } else if (props.qualifier) {
    await updateQualifierMappool(props.qualifier.id, mappoolId, { isVisible });
  }
}

async function updateDate(displayMappoolsSchedule: string, mappoolId: number) {
  if (props.tournament) {
    await updateTournamentMappool(props.tournament.id, mappoolId, { displayMappoolsSchedule });
  } else if (props.qualifier) {
    await updateQualifierMappool(props.qualifier.id, mappoolId, { displayMappoolsSchedule });
  }
}
</script>

<template>
  <el-button v-bind="useAttrs()" type="primary" :icon="Setting" @click.stop="showDialog = true" />

  <el-dialog v-model="showDialog">
    <CommonDatepicker
      :model-value="mappoolSchedule"
      :title="'Date where the mappool can be public'"
      :type="'datetime'"
      @update:model-value="(val) => (mappoolSchedule = dayjs(val).utc().format())"
      @change="(val: string) => updateDate(dayjs(val).utc().format(), mappool.id)"
    />

    <el-switch
      :model-value="mappool.isVisible"
      :loading="isVisibleLoading"
      @update:model-value="(val: boolean) => updateVisibility(val, mappool.id)"
    />
    <el-button v-if="tournament" type="danger" plain @click="deleteMappool(mappool.id)">Delete</el-button>
  </el-dialog>
</template>
