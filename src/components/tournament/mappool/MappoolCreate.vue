<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Tournament } from '~/types';

dayjs.extend(utc);

const { createTournamentMappool } = mappoolStore();
const { tournamentMappools } = storeToRefs(mappoolStore());

const props = defineProps<{
  tournament: Tournament;
}>();

let showCreate = $ref(false);
let loading = $ref(false);
const rounds = ref([]);
const mappoolDateCreate = ref<string | undefined>(undefined);

async function createMappool() {
  loading = true;
  await createTournamentMappool(props.tournament.id, {
    rounds: rounds.value,
    displayMappoolsSchedule: mappoolDateCreate.value,
  });
  loading = false;
  showCreate = false;
  rounds.value = [];
  mappoolDateCreate.value = undefined;
}

const roundOptions = computed(() => {
  if (!props.tournament.numbersPlayers) return undefined;
  let incrementations = 0;
  const res: number[] = [];
  for (let i = 1; i < props.tournament.numbersPlayers; i *= 2) {
    res.push((incrementations += 1));
  }
  res.push((incrementations += 1));

  const forDeletion = tournamentMappools.value?.map((mappool) => mappool.round);

  return res.filter((item) => !forDeletion?.includes(item));
});
</script>
<template>
  <el-button v-if="roundOptions?.length" type="primary" text @click="showCreate = true">create new mappool</el-button>
  <div v-if="!roundOptions">Before create mappool, please set the numbers player</div>

  <el-dialog v-model="showCreate" title="Tips" w="3/10">
    <div display="grid" grid="cols-2 gap-2" justify="items-center">
      <div>
        <span display="block">Rounds</span>
        <el-select v-model="rounds" size="large" multiple collapse-tags>
          <el-option v-for="(item, i) in roundOptions" :key="i" :value="item" />
        </el-select>
      </div>
      <CommonDatepicker
        :model-value="mappoolDateCreate"
        :title="'Date where the mappool can be public'"
        :type="'datetime'"
        @update:model-value="(val) => (mappoolDateCreate = dayjs(val).utc().format())"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-loading="loading" @click="showCreate = false">Cancel</el-button>
        <el-button type="primary" @click="createMappool">Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>
