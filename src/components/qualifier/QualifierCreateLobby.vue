<script lang="ts" setup>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { createLobby } = qualifierStore();
const { qualifier } = storeToRefs(qualifierStore());
const { access } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());

const schedule = ref();
</script>

<template>
  <div v-if="user && (access?.isAdmin || access?.isReferee || access?.isOwner)">
    <el-input v-model="user.username" :disabled="true">{{ user.username }}</el-input>
    <CommonDatepicker
      :model-value="schedule"
      type="datetime"
      title="date of lobby start"
      @update:model-value="(val) => (schedule = dayjs(val).utc().format())"
    />
    <el-button type="success" @click="createLobby(qualifier?.id as number, schedule)">créer un lobby</el-button>
  </div>
</template>
