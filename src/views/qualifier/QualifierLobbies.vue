<script lang="ts" setup>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { fetchQualifier, fetchQualifierLobbies } = qualifierStore();
const { qualifier } = storeToRefs(qualifierStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);

async function init() {
  await fetchQualifier(tournamentId);
  fetchQualifierLobbies(qualifier.value?.id as number);
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});
</script>

<template>
  <div v-if="!initLoading"></div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
