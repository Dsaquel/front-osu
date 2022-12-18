<script setup lang="ts">
import router from '~/router';
import draftStore from '~/store/draft.store';
import { DraftDto } from '~/types';

const { create } = draftStore();
const { user } = storeToRefs(userStore());

const name = $ref('');
const details = $ref(null);
const rangePlayerMax = $ref(null);
const rangePlayerMin = $ref(null);
const numbersPlayers = $ref(null);
const estimateStartDate = $ref(null);
const type = $ref('standard');

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
  create(payload);
  // router.push({
  //   name: 'user-tournament-draft',
  //   params: { id: user?.id },
  // });
}
</script>

<template>
  <TemplateDraft v-model:name="name">
    <template name="last">
      <button grid="col-end-3 " w="min-content" place="self-end" text="black" bg="light-50" @click="submit"></button>
    </template>
  </TemplateDraft>
</template>
