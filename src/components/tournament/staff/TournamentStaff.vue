<script lang="ts" setup>
import { onBeforeMount } from 'vue';

const { fetchStaffs } = tournamentStore();

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
    <div>tournament staff desu</div>
    <slot name="goRequests" />
  </div>
</template>
