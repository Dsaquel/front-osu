<script setup lang="ts">
const { updateTournamentDraft } = userStore();
const { create } = tournamentUserStore();
const { user } = storeToRefs(userStore());

const { name, numbersPlayers, estimateStartDate, description } = computed(() => ({
  ...user.value?.tournamentDraft,
})).value;

const initialName = ref(name ?? '');
const initialNumbersPlayers = ref(numbersPlayers);
const initialEstimateStartDate = ref(estimateStartDate);
const initialDescription = ref(description);

const timeout = useTimeoutFn(
  () => {
    updateTournamentDraft({
      name: initialName.value,
      numbersPlayers: initialNumbersPlayers.value,
      estimateStartDate: initialEstimateStartDate.value,
      description: initialDescription.value,
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
  () => [initialName.value, initialNumbersPlayers.value, initialEstimateStartDate.value, initialDescription.value],
  () => {
    timeoutManaging();
  },
);

function submit() {
  const payload = {
    name: initialName.value,
    numbersPlayers: initialNumbersPlayers.value,
    estimateStartDate: initialEstimateStartDate.value,
    hasQualifier: true,
  };
  create(payload);
  useRouter().push();
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
        <span text="sm">Description</span>
        <MarkdownTextarea v-model="initialDescription" />
      </div>
      <CommonDatepicker v-model="initialEstimateStartDate" :title="'Estimation start'" :type="'month'" />
      <button grid="col-end-3 " w="min-content" place="self-end" text="black" bg="light-50" @click="submit">
        Submit
      </button>
    </div>
  </div>
</template>
