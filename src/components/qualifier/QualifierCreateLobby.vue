<script lang="ts" setup>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { createLobby } = qualifierStore();
const { fetchControlAccess } = tournamentStore();
const { qualifier } = storeToRefs(qualifierStore());
const { access } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
const schedule = ref();
const showCreate = ref(false);

onBeforeMount(async () => {
  await fetchControlAccess(tournamentId);
});
</script>

<template>
  <div v-if="user && (access?.isAdmin || access?.isReferee || access?.isOwner)">
    <el-button type="success" @click.stop="showCreate = true">create new lobby</el-button>

    <el-dialog v-model="showCreate">
      <el-input v-model="user.username" :disabled="true">{{ user.username }}</el-input>
      <CommonDatepicker
        :model-value="schedule"
        type="datetime"
        title="date of lobby start"
        @update:model-value="(val) => (schedule = dayjs(val).utc().format())"
      />
      <el-button type="success" @click="createLobby(qualifier?.id as number, schedule)">create lobby</el-button>
    </el-dialog>
  </div>
</template>
