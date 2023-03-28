<script lang="ts" setup>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { createLobby } = qualifierStore();
const { fetchControlAccess } = tournamentStore();
const { qualifier } = storeToRefs(qualifierStore());
const { access, isOwnerOrAdmin } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
const schedule = ref<string | undefined>(undefined);
const showCreate = ref(false);
let createLobbyLoading = $ref(false);

onBeforeMount(async () => {
  await fetchControlAccess(tournamentId);
});

function resetSettings() {
  schedule.value = undefined;
  showCreate.value = false;
}

async function createLobbyTemplate(qualifierId: number) {
  try {
    createLobbyLoading = true;
    await createLobby(qualifierId, schedule.value as string);
    ElMessage.success({ message: 'lobby created !', duration: 1000 });
  } catch (e) {
    ElMessage.error({ message: 'error ! try again', duration: 1000 });
  } finally {
    createLobbyLoading = false;
    resetSettings();
  }
}
</script>

<template>
  <div v-if="qualifier && user && (isOwnerOrAdmin || access?.isReferee)">
    <el-button type="success" @click.stop="showCreate = true">create new lobby</el-button>

    <el-dialog v-model="showCreate" @close="resetSettings">
      <div display="grid" grid="cols-4" justify="items-center">
        <div grid="col-span-2">
          <span display="block" text="sm">referee</span>
          <el-input v-model="user.username" size="large" disabled />
        </div>
        <CommonDatepicker
          grid="col-span-2"
          :model-value="schedule"
          type="datetime"
          title="date of lobby start"
          @update:model-value="(val) => (schedule = dayjs(val).utc().format())"
        />
        <el-button
          grid="col-span-full"
          :disabled="!schedule"
          :loading="createLobbyLoading"
          type="success"
          @click="createLobbyTemplate(qualifier?.id as number)"
        >
          create lobby
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
