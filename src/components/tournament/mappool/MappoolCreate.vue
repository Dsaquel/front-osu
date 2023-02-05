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
const isMappoolVisible = ref(false);
const mappoolDateCreate = ref<string | undefined>(undefined);

async function createMappool() {
  loading = true;
  await createTournamentMappool(props.tournament.id, {
    rounds: rounds.value,
    displayMappoolsSchedule: mappoolDateCreate.value,
    isVisible: isMappoolVisible.value,
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
  <el-button v-if="roundOptions?.length" v-bind="useAttrs()" type="success" @click="showCreate = true">
    create new mappool
  </el-button>
  <div v-if="!roundOptions">Before create mappool, please set the numbers player</div>

  <el-dialog v-model="showCreate" title="Create mappool" w="5/10 min-[600px]" class="<sm:min-w-full">
    <div display="grid" grid="cols-1 gap-2" justify="items-center">
      <div>
        <span display="block">Rounds</span>
        <el-select v-model="rounds" size="large" multiple collapse-tags>
          <el-option v-for="(item, i) in roundOptions" :key="i" :value="item" />
        </el-select>
      </div>
      <el-switch
        v-model="isMappoolVisible"
        active-text="wont be visible until schedule"
        inactive-text="will be public when tournament start"
        size="large"
      />
      <CommonDatepicker
        v-if="isMappoolVisible"
        :model-value="mappoolDateCreate"
        :title="'Schedule mappool (can be set later)'"
        :type="'datetime'"
        @update:model-value="(val) => (mappoolDateCreate = dayjs(val).utc().format())"
      />
    </div>
    <template #footer>
      <span>
        <el-button @click="showCreate = false">Cancel</el-button>
        <el-button :loading="loading" type="primary" :disabled="!rounds.length" @click="createMappool"
          >Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
div {
  white-space: nowrap;
}
</style>
