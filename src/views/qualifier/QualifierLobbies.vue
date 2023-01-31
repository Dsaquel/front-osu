<script lang="ts" setup>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { fetchControlAccess } = tournamentStore();
const { access, isAuthorized } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);
const schedule = ref();
async function init() {
  await fetchControlAccess(tournamentId);
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});
</script>

<template>
  <div v-if="!initLoading">
    <div v-if="user && (access?.isAdmin || access?.isReferee || access?.isOwner)">
      <el-input v-model="user.username" :disabled="true">{{ user.username }}</el-input>

      <CommonDatepicker
        :model-value="schedule"
        type="datetime"
        title="date of lobby start"
        @update="(val) => (schedule = dayjs(val).utc().format())"
      />
    </div>
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
