<script setup lang="ts">
import draftStore from '~/store/draft.store';

const { update, fetch } = draftStore();
const { draft } = storeToRefs(draftStore());

const draftId = $ref(parseInt(useRoute().params?.draftId as string, 10));

function init() {
  if (!draftId) return;
  fetch(draftId);
}

onBeforeMount(() => init());

watch(
  () => draftId,
  () => init(),
);

const { name, numbersPlayers, estimateStartDate, details, rangePlayerMax, rangePlayerMin, type } = computed(() => ({
  ...draft.value,
})).value;

const initialName = $ref(name ?? '');
const initialNumbersPlayers = $ref(numbersPlayers);
const initialEstimateStartDate = $ref(estimateStartDate);
const initialDetails = $ref(details);
const initialRangePlayerMax = $ref(rangePlayerMax);
const initialRangePlayerMin = $ref(rangePlayerMin);
const initialType = $ref(type);

const timeout = useTimeoutFn(
  () => {
    update({
      name: initialName,
      numbersPlayers: initialNumbersPlayers,
      estimateStartDate: initialEstimateStartDate,
      details: initialDetails,
      rangePlayerMax: initialRangePlayerMax,
      rangePlayerMin: initialRangePlayerMin,
      type: initialType,
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
  () => [
    initialName,
    initialNumbersPlayers,
    initialEstimateStartDate,
    details,
    initialRangePlayerMax,
    initialRangePlayerMin,
    initialType,
  ],
  () => {
    timeoutManaging();
  },
);
</script>

<template>
  <TemplateDraft
    v-model:name="initialName"
    v-model:details="details"
    v-model:numbersPlayers="initialNumbersPlayers"
    v-model:estimateStartDate="initialEstimateStartDate"
    v-model:rangePlayerMax="initialRangePlayerMax"
    v-model:rangePlayerMin="initialRangePlayerMin"
    v-model:type="initialType"
  >
    <template name="last">
      <button grid="col-end-3 " w="min-content" place="self-end" text="black" bg="light-50">update</button>
    </template>
  </TemplateDraft>
</template>
