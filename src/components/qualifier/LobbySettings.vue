<script lang="ts" setup>
import { Setting } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

type LobbyStatus = 'pending' | 'started' | 'finished';

const { updateLobby, deleteLobby } = qualifierStore();
const { qualifier } = storeToRefs(qualifierStore());
const { access } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());

const showUpdate = ref(false);
let globalLoading = $ref(false);
const statusOptions = ['pending', 'started', 'finished'];

const props = defineProps<{
  lobbyId: number;
  schedule?: string;
  status?: LobbyStatus;
}>();

const { lobbyId, schedule, status } = toRefs(props);

async function updateLobbyTemplate() {
  try {
    if (!qualifier.value) return;
    if (schedule?.value === null || schedule?.value === '') return;

    globalLoading = true;
    await updateLobby(lobbyId.value, qualifier.value.id as number, {
      schedule: schedule?.value,
      status: status?.value,
    });
    ElMessage.success({ message: 'lobby deleted !', duration: 1000 });
  } catch (e) {
    ElMessage.error({ message: 'error ! try again', duration: 1000 });
  } finally {
    globalLoading = false;
    showUpdate.value = false;
  }
}

async function deleteLobbyTemplate() {
  try {
    globalLoading = true;
    await deleteLobby(qualifier.value?.id as number, lobbyId.value);
    ElMessage.success({ message: 'lobby deleted !', duration: 1000 });
  } catch (e) {
    ElMessage.error({ message: 'error ! try again', duration: 1000 });
  } finally {
    globalLoading = false;
    showUpdate.value = false;
  }
}
</script>

<template>
  <div v-if="qualifier && user && (access?.isAdmin || access?.isReferee || access?.isOwner)">
    <el-button m="l-1" type="primary" :icon="Setting" @click="showUpdate = true" />

    <el-dialog v-model="showUpdate">
      <div display="grid" grid="cols-4" justify="items-center">
        <el-select grid="col-span-2" :model-value="status" @change="updateLobbyTemplate">
          <el-option v-for="(item, v) in statusOptions" :key="v" :value="item" />
        </el-select>

        <CommonDatepicker
          grid="col-span-2"
          :model-value="schedule"
          type="datetime"
          title="date of lobby start"
          @update:model-value="(val) => (schedule = dayjs(val).utc().format())"
          @change="updateLobbyTemplate"
        />
        <el-button
          v-if="access?.isAdmin || access?.isOwner || access?.isReferee"
          type="danger"
          size="small"
          text
          :loading="globalLoading"
          @click="deleteLobbyTemplate"
        >
          delete
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
