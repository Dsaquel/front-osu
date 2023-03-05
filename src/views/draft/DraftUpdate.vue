<script setup lang="ts">
import { isEqual } from 'lodash';

const { update, fetchDraft } = draftStore();
const { draft } = storeToRefs(draftStore());

const initLoading = ref(false);
let loading = $ref(false);
const draftId = $ref(parseInt(useRoute().params?.draftId as string, 10));

async function init() {
  try {
    await fetchDraft(draftId);
  } catch (e) {
    console.log('init error', e);
  }
}

onBeforeMount(async () => {
  initLoading.value = true;
  await init();
  initLoading.value = false;
});

watch(
  () => draftId,
  () => init(),
);

const timeout = useTimeoutFn(
  async () => {
    if (!draft.value) loading = true;
    await update(
      {
        name: draft.value?.name,
        numbersPlayers: draft.value?.numbersPlayers as number,
        estimateStartDate: draft.value?.estimateStartDate as string,
        details: draft.value?.details as string,
        rangePlayerMax: draft.value?.rangePlayerMax as number,
        rangePlayerMin: draft.value?.rangePlayerMin as number,
        type: draft.value?.type,
      },
      draft.value?.id as number,
    );
    loading = false;
    timeout.stop();
  },
  2000,
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
  () => draft.value,
  (newVal, oldVal) => {
    if ((oldVal === undefined && newVal !== undefined) || !isEqual(newVal, oldVal)) return;
    timeoutManaging();
  },
  { deep: true },
);
</script>

<template>
  <div v-if="!initLoading">
    <TemplateDraft
      v-if="draft"
      v-model:name="draft.name"
      v-model:details="draft.details"
      v-model:numbersPlayers="draft.numbersPlayers"
      v-model:estimateStartDate="draft.estimateStartDate"
      v-model:rangePlayerMax="draft.rangePlayerMax"
      v-model:rangePlayerMin="draft.rangePlayerMin"
      v-model:type="draft.type"
    >
      <template #last>
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
          last update: {{ useTimeAgo(draft.updateAt).value }}
        </div>
      </template>
    </TemplateDraft>

    <el-empty v-else>
      <template #description>
        <div display="block" m="b-2">I dont have this draft sorry</div>
      </template>
    </el-empty>
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
