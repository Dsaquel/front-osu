<script lang="ts" setup>
import { onBeforeMount } from 'vue';

const { fetchStaffs } = tournamentStore();
const {
  staffsAccepted } = storeToRefs(tournamentStore());

const props = defineProps<{
  tournamentId: number;
}>();

async function init() {
  fetchStaffs(props.tournamentId);
}

onBeforeMount(async () => {
  init();
});
</script>

<template>
  <div>
    <slot name="goRequests" />
    <TournamentStaffTable :data="staffsAccepted" />
  </div>
</template>
