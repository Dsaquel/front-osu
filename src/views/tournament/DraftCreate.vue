<script setup lang="ts">
import draftStore from '~/store/draft.store';
import { DraftDto } from '~/types';

const { create } = draftStore();
const { user } = storeToRefs(userStore());

const name = $ref('name');
const details = $ref(null);
const rangePlayerMax = $ref(null);
const rangePlayerMin = $ref(null);
const numbersPlayers = $ref(null);
const estimateStartDate = $ref(null);
const type = $ref<'standard' | 'taiko'>('standard');

function submit() {
  const payload: DraftDto = {
    name,
    details,
    numbersPlayers,
    estimateStartDate,
    rangePlayerMin,
    rangePlayerMax,
    type,
  };
  console.log(payload);
  // create(payload);
  // router.push({
  //   name: 'user-tournament-draft',
  //   params: { id: user?.id },
  // });
}
</script>

<template>
  <TemplateDraft
    v-model:name="name"
    v-model:details="details"
    v-model:numbersPlayers="numbersPlayers"
    v-model:estimateStartDate="estimateStartDate"
    v-model:rangePlayerMin="rangePlayerMin"
    v-model:rangePlayerMax="rangePlayerMax"
    v-model:type="type"
  >
    <template #last>
      <button grid="col-end-3 " w="min-content" place="self-end" text="black" bg="light-50" @click="submit"></button>
    </template>
  </TemplateDraft>
</template>
