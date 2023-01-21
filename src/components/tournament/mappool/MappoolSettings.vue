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
  qualifier?: Qualifier | null;
}>();

const showDialog = ref(false);
let isVisibleLoading = $ref(false);
let globalLoading = $ref(false);

const mappoolSchedule = ref(props.mappool.displayMappoolsSchedule);

function deleteMappool(mappoolId: number) {
  if (props.tournament) deleteTournamentMappool(props.tournament.id, mappoolId);
}

async function updateVisibility(isVisible: boolean, mappoolId: number) {
  if (props.tournament) {
    isVisibleLoading = true;
    globalLoading = true;
    await updateTournamentMappool(props.tournament.id, mappoolId, { isVisible });
    isVisibleLoading = false;
    globalLoading = false;
  } else if (props.qualifier) {
    await updateQualifierMappool(props.qualifier.id, mappoolId, { isVisible });
  }
}

async function updateDate(displayMappoolsSchedule: string, mappoolId: number) {
  globalLoading = true;
  if (props.tournament) {
    await updateTournamentMappool(props.tournament.id, mappoolId, { displayMappoolsSchedule });
  } else if (props.qualifier) {
    await updateQualifierMappool(props.qualifier.id, mappoolId, { displayMappoolsSchedule });
  }
  globalLoading = false;
}
</script>

<template>
  <el-button v-bind="useAttrs()" type="primary" :icon="Setting" @click.stop="showDialog = true" />

  <el-dialog v-model="showDialog" append-to-body>
    <template #header>
      <div v-if="'tournamentId' in mappool">
        {{ `Edit round ${mappool.round}` }}
      </div>
      <div v-if="'qualifierId' in mappool">Edit qualifier</div>
    </template>
    <div display="grid" grid="cols-1 gap-2" justify="items-start">
      <el-switch
        :model-value="mappool.isVisible"
        :loading="isVisibleLoading"
        active-text="wont be visible until schedule"
        inactive-text="will be public when tournament start"
        size="large"
        @update:model-value="(val: boolean) => updateVisibility(val, mappool.id)"
      />
      <CommonDatepicker
        v-if="mappool.isVisible"
        :model-value="mappoolSchedule"
        :title="'Schedule mappool'"
        :type="'datetime'"
        @update:model-value="(val) => (mappoolSchedule = dayjs(val).utc().format())"
        @change="(val: string) => updateDate(dayjs(val).utc().format(), mappool.id)"
      />

      <el-button v-if="tournament" type="danger" place="self-start" plain @click="deleteMappool(mappool.id)"
        >Delete the mappool</el-button
      >
    </div>
    <template #footer>
      <div>
        last update:
        <span v-if="!globalLoading">{{ useTimeAgo(mappool.updateAt).value }} </span>
        <span v-loading="globalLoading" />
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
div {
  white-space: nowrap;
}
</style>
