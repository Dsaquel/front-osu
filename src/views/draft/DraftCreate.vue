<script setup lang="ts">
import draftStore from '~/store/draft.store';
import { DraftDto } from '~/types';

const { create } = draftStore();
// const { user } = storeToRefs(userStore());
const router = useRouter();

const name = $ref('name');
const details = $ref(undefined);
const rangePlayerMax = $ref(undefined);
const rangePlayerMin = $ref(undefined);
const numbersPlayers = $ref(undefined);
const estimateStartDate = $ref(undefined);
const type = $ref<'standard' | 'taiko'>('standard');

async function submit() {
  const payload: DraftDto = {
    name,
    details,
    numbersPlayers,
    estimateStartDate,
    rangePlayerMin,
    rangePlayerMax,
    type,
  };
  const draftCreate = await create(payload);
  console.log(draftCreate);
  router.push({
    name: 'draft-update',
    params: { draftId: draftCreate.id },
  });
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
      <button grid="col-end-3 " w="min-content" place="self-end" text="black" bg="light-50" @click="submit">
        submit
      </button>
    </template>
  </TemplateDraft>
</template>
