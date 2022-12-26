<script setup lang="ts">
const { update, fetch } = draftStore();

const { draft } = storeToRefs(draftStore());
let loading = $ref(true);
const draftId = $ref(parseInt(useRoute().params?.draftId as string, 10));
async function init() {
  if (!draftId) return;
  await fetch(draftId);
}

onMounted(() => {
  loading = false;
  init();
});

watch(
  () => draftId,
  () => init(),
);

const timeout = useTimeoutFn(
  async () => {
    loading = true;
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
watchEffect(() => {
  if (draft.value) {
    timeoutManaging();
  }
});
watch(
  draft,
  () => {
    timeoutManaging();
  },
  { deep: true },
);
</script>

<template>
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

  <div v-else>no draft to update</div>
</template>
