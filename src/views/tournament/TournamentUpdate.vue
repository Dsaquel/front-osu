<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
const { fetch, update } = tournamentStore();
const { tournament } = storeToRefs(tournamentStore());
async function init() {
  if (!tournamentId) return;
  fetch(tournamentId);
}

let loading = $ref(false);

onMounted(() => {
  init();
});

watch(
  () => tournamentId,
  () => init(),
);

const rankRang = computed(() =>
  ((tournament?.value?.rangePlayerMin === 1 || tournament?.value?.rangePlayerMin === null) &&
    tournament?.value.rangePlayerMax === null) ||
  (tournament?.value?.rangePlayerMin === undefined && tournament?.value?.rangePlayerMax === undefined)
    ? 'Open rank'
    : `${tournament?.value.rangePlayerMin} to ${tournament?.value.rangePlayerMax}`,
);

const timeout = useTimeoutFn(
  async () => {
    if (!tournament.value) loading = true;
    await update({
      name: tournament.value?.name,
      numbersPlayers: tournament.value?.numbersPlayers ?? undefined,
      startDate: tournament.value?.startDate as string,
      description: tournament.value?.description ?? '',
      rangePlayerMax: tournament.value?.rangePlayerMax,
      rangePlayerMin: tournament.value?.rangePlayerMin,
      type: tournament.value?.type,
      endRegistration: tournament.value?.endRegistration,
    });
    loading = false;
    timeout.stop();
  },
  3000,
  { immediate: false },
);

function timeoutManaging() {
  timeout.start();
  if (timeout.isPending) {
    timeout.stop();
    timeout.start();
  }
}
watch(
  tournament,
  () => {
    timeoutManaging();
  },
  { deep: true },
);
</script>

<template>
  <div v-if="tournament" class="card">
    <div p="10" grid="~ rows-1 cols-2 gap-6">
      <div>
        <span display="block" text="sm"> Name </span>
        <el-input v-model="tournament.name" size="large" />
      </div>
      <div text="right">
        <span display="block" text="sm"> Number of players max </span>
        <el-select
          :model-value="(tournament.numbersPlayers as number)"
          size="large"
          w="full"
          @change="(val) => (tournament.numbersPlayers = val)"
        >
          <el-option :value="4" />
          <el-option :value="16" />
          <el-option :value="32" />
        </el-select>
      </div>
      <div grid="col-span-2">
        <span text="sm">Details</span>
        <!-- to test -->
        <MarkdownTextarea v-model:text="tournament.description" />
      </div>
      <CommonDatepicker
        :model-value="tournament.startDate"
        :title="'Estimation start'"
        :type="'month'"
        @update:model-value="(val) => (tournament.startDate = dayjs(val).utc().format())"
      />
      <div grid="~ cols-2">
        <div m="x-2">
          <span display="block" text="sm">player rank mini</span>
          <el-input-number v-model="tournament.rangePlayerMin" size="large" :min="1" :value-on-clear="1" :step="100" />
        </div>
        <div m="x-2">
          <span display="block" text="right sm">player rank max</span>
          <el-input-number v-model="tournament.rangePlayerMax" size="large" :value-on-clear="null" />
        </div>
        <div grid="col-span-2" text="center" m="t-5">
          rank range:
          {{ rankRang }}
        </div>
      </div>
      <div>
        <CommonDatepicker
          :model-value="tournament.endRegistration"
          :title="'End of registration (utc)'"
          :type="'datetime'"
          @update:model-value="(val) => (tournament.endRegistration = dayjs(val).utc().format())"
        />
      </div>
      <div text="right">
        <span display="block" text="sm"> type </span>
        <el-select :model-value="tournament.type" size="large" w="full" @change="(val) => (tournament.type = val)">
          <el-option value="standard" />
          <el-option value="taiko" />
        </el-select>
      </div>
      <div
        v-if="loading"
        v-loading="loading"
        grid="col-end-3"
        w="min-content"
        place="self-end"
        text="black"
        bg="light-50"
        m="r-8"
      />
      <div v-else grid="col-end-3" w="min-content" place="self-end" class="whitespace-nowrap">
        last update: {{ useTimeAgo(tournament.updateAt).value }}
      </div>
    </div>
  </div>
  <div v-else>No tournament</div>
</template>