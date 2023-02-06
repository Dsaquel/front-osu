<script lang="ts" setup>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { updateLobby } = qualifierStore();
const { qualifier } = storeToRefs(qualifierStore());
const { access } = storeToRefs(tournamentStore());
const { user } = storeToRefs(userStore());

const showUpdate = ref(false);
let updateLobbyLoading = $ref(false);

async function createLobbyTemplate(qualifierId: number) {
  try {
    updateLobbyLoading = true;
    await updateLobby(qualifierId, {});
    ElMessage.success({ message: 'lobby updated !', duration: 1000 });
  } catch (e) {
    ElMessage.error({ message: 'error ! try again', duration: 1000 });
  } finally {
    updateLobbyLoading = false;
    showUpdate.value = false;
  }
}
</script>

<template>
  <div v-if="qualifier && user && (access?.isAdmin || access?.isReferee || access?.isOwner)">
    <el-button size="small" plain round m="l-1" @click="showUpdate = true"><i-material-symbols:edit /> </el-button>

    <el-dialog v-model="showUpdate">
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
          :loading="updateLobbyLoading"
          type="success"
          @click="createLobbyTemplate(qualifier?.id as number)"
        >
          create lobby
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
