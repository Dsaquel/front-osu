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
  status?: LobbyStatus;
  schedule?: string;
  updateAt: string;
}>();

const statusTemplate = ref(props.status);
const scheduleTemplate = ref(props.schedule);

async function updateLobbyTemplate() {
  try {
    if (!qualifier.value) return;
    if (scheduleTemplate.value === null || scheduleTemplate.value === '') return;

    globalLoading = true;
    await updateLobby(props.lobbyId, qualifier.value.id as number, {
      schedule: scheduleTemplate.value,
      status: statusTemplate.value,
    });
    ElMessage.success({ message: 'lobby updated !', duration: 1000 });
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
    await deleteLobby(qualifier.value?.id as number, props.lobbyId);
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

    <el-dialog v-model="showUpdate" v-bind="useAttrs()">
      <div display="grid" grid="cols-2 gap-2">
        <div>
          <span display="block">Status</span>
          <el-select v-model="statusTemplate" @change="updateLobbyTemplate">
            <el-option v-for="(item, v) in statusOptions" :key="v" :value="item" />
          </el-select>
        </div>

        <CommonDatepicker
          :model-value="scheduleTemplate"
          type="datetime"
          title="Date of lobby start"
          @update:model-value="(val) => (scheduleTemplate = dayjs(val).utc().format())"
          @change="updateLobbyTemplate"
        />
        <el-button
          v-if="access?.isAdmin || access?.isOwner || access?.isReferee"
          type="danger"
          place="self-center"
          plain
          @click="deleteLobbyTemplate"
        >
          delete lobby
        </el-button>
      </div>
      <template #footer>
        <div>
          last update:
          <span v-if="!globalLoading">{{ useTimeAgo(updateAt).value }} </span>
          <span v-loading="globalLoading" />
        </div>
      </template>
    </el-dialog>
  </div>
</template>
