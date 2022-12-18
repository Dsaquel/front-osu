<script setup lang="ts">
import router from '~/router';
import draftStore from '~/store/draft.store';
import { DraftDto } from '~/types';

const { create } = draftStore();
const { draft } = storeToRefs(draftStore());
const { user } = storeToRefs(userStore());

const { name, numbersPlayers, estimateStartDate, details,rangePlayerMax, rangePlayerMin, type } = computed(() => ({
  ...draft.value,
})).value;

const initialName = ref(name);
const initialDetails = ref(details);
const initialRangePlayerMax = ref(rangePlayerMax)
const initialRangePlayerMin = ref(rangePlayerMin)
const initialNumbersPlayers = ref(numbersPlayers);
const initialEstimateStartDate = ref(estimateStartDate);
const initialType = ref(type)

const timeout = useTimeoutFn(
  () => {
    updateDraft({
      name: initialName.value,
      numbersPlayers: initialNumbersPlayers.value,
      estimateStartDate: initialEstimateStartDate.value,
      details: initialDetails.value,
    });
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
  () => [initialName.value, initialNumbersPlayers.value, initialEstimateStartDate.value, initialDetails.value],
  () => {
    timeoutManaging();
  },
);

function submit() {
  const payload: DraftDto = {
    name: initialName.value,
    numbersPlayers: initialNumbersPlayers.value,
    estimateStartDate: initialEstimateStartDate.value,
    numbersPlayers
    rangePlayerMin
    rangePlayerMax
    type
  };
  create(payload);
  router.push({
    name: 'user-tournament-draft',
    params: { id: user.value?.id },
  });
}
</script>

<template>
  <div m="x-auto" class="card sm:max-w-1200px">
    <div p="10" grid="~ rows-1 cols-2 gap-6">
      <div>
        <span display="block" text="sm"> Name </span>
        <el-input v-model="initialName" size="large" />
      </div>

      <div text="right">
        <span display="block" text="sm"> Number of players max </span>
        <el-select v-model="initialNumbersPlayers" size="large" w="full">
          <el-option :value="4" />
          <el-option :value="16" />
          <el-option :value="32" />
        </el-select>
      </div>
      <div grid="col-span-2">
        <span text="sm">details</span>
        <MarkdownTextarea v-model="initialDetails" />
      </div>
      <CommonDatepicker v-model="initialEstimateStartDate" :title="'Estimation start'" :type="'month'" />
      <button grid="col-end-3 " w="min-content" place="self-end" text="black" bg="light-50" @click="submit">
        Submit
      </button>
    </div>
  </div>
</template>
