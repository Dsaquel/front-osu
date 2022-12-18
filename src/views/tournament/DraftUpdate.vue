<script setup lang="ts">
import router from '~/router';
import draftStore from '~/store/draft.store';
import { DraftDto } from '~/types';

const { update } = draftStore();
const { user } = storeToRefs(userStore());

const { name, numbersPlayers, estimateStartDate, details, rangePlayerMax, rangePlayerMin, type } = computed(() => ({
  ...draft,
}));

const name = $('');
const details = $();
const rangePlayerMax = $();
const rangePlayerMin = $();
const numbersPlayers = $();
const estimateStartDate = $();
const type = $();

const timeout = useTimeoutFn(
  () => {
    updateDraft({
      name,
      numbersPlayers,
      estimateStartDate,
      details,
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
  () => [Name, NumbersPlayers, EstimateStartDate, Details],
  () => {
    timeoutManaging();
  },
);
</script>

<template>
  <TemplateDraft v-model:name="name">
    <template name="last">
      <button grid="col-end-3 " w="min-content" place="self-end" text="black" bg="light-50" @click="submit"></button>
    </template>
  </TemplateDraft>
</template>
