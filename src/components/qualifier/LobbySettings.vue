<script lang="ts" setup>
import { Setting } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Lobby } from '~/types';

dayjs.extend(utc);

type LobbyStatus = 'pending' | 'started' | 'finished';

const { updateLobby, deleteLobby } = qualifierStore();
const { qualifier } = storeToRefs(qualifierStore());
const { access } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());

const showUpdate = ref(false);
let globalLoading = $ref(false);

const props = defineProps<{
  schedule?: string;
  status?: LobbyStatus;
}>();

const { schedule, status } = toRefs(props);

async function updateLobbyTemplate(lobbyId: number) {
  try {
    if (!qualifier.value) return;
    if (schedule?.value === null || schedule?.value === '') return;

    globalLoading = true;
    await updateLobby(lobbyId, qualifier.value.id as number, { schedule: schedule?.value, status: status?.value });
    ElMessage.success({ message: 'lobby deleted !', duration: 1000 });
  } catch (e) {
    ElMessage.error({ message: 'error ! try again', duration: 1000 });
  } finally {
    globalLoading = false;
    showUpdate.value = false;
  }
}

async function deleteLobbyTemplate(lobbyId: number) {
  try {
    globalLoading = true;
    await deleteLobby(qualifier.value?.id as number, lobbyId);
    ElMessage.success({ message: 'lobby deleted !', duration: 1000 });
  } catch (e) {
    ElMessage.error({ message: 'error ! try again', duration: 1000 });
  } finally {
    globalLoading = false;
    showUpdate.value = false;
  }
}

function getLobby(row: Lobby) {
  return row;
}
</script>

<template>
  <div v-if="qualifier && user && (access?.isAdmin || access?.isReferee || access?.isOwner)">
    <el-button m="l-1" type="primary" :icon="Setting" @click="showUpdate = true" />

    <el-dialog v-model="showUpdate">
      <div display="grid" grid="cols-4" justify="items-center">
        <div grid="col-span-2">
          <span display="block" text="sm">referee</span>
          <el-input v-model="user.username" size="large" disabled />
        </div>
        <CommonDatepicker
          grid="col-span-2"
          :model-value="2"
          type="datetime"
          title="date of lobby start"
          @update:model-value="(val) => (schedule = dayjs(val).utc().format())"
          @change="(val: string) => updateDate(dayjs(val).utc().format(), mappool.id)"
        />
        <el-button
          v-if="isAuthorized && (access?.isAdmin || access?.isOwner || access?.isReferee)"
          type="danger"
          size="small"
          text
          :loading="globalLoading"
          @click="deleteLobbyTemplate(getLobby(scope.row).id)"
        >
          delete
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
