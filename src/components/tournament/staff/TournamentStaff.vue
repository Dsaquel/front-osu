<script lang="ts" setup>
import { Avatar, DeleteFilled, Plus } from '@element-plus/icons-vue';
import { onBeforeMount } from 'vue';
import { Role, TemplateNotification } from '~/types';

const { fetchStaffs, removeStaff, addStaff } = tournamentStore();
const { staffsAccepted, isAuthorized, access } = storeToRefs(tournamentStore());

const props = defineProps<{
  tournamentId: number;
}>();

const initLoading = ref(false);

async function init() {
  try {
    await fetchStaffs(props.tournamentId);
  } catch (e) {
    console.log('init error', e);
  }
}

onBeforeMount(async () => {
  initLoading.value = true;
  await init();
  initLoading.value = false;
});

async function remove(staffId: number, roles: Exclude<Role, 'admin'>[], secondStaffId?: number | undefined) {
  try {
    const data = await removeStaff(props.tournamentId, staffId, roles[0]);
    ElNotification({ title: data.subject, message: data.message, type: 'success', zIndex: 10, duration: 0 });
    if (secondStaffId) {
      const secondData = await removeStaff(props.tournamentId, secondStaffId, roles[1]);
      ElNotification({
        title: secondData.subject,
        message: secondData.message,
        type: 'success',
        zIndex: 10,
        duration: 0,
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e, 'error');
    } else {
      ElNotification({
        title: (<TemplateNotification>e).subject,
        message: (<TemplateNotification>e).message,
        type: 'error',
        zIndex: 10,
        duration: 0,
      });
    }
  }
}

async function upToAdmin(staffId: number, roles: Exclude<Role, 'admin'>[], secondStaffId?: number | undefined) {
  await removeStaff(props.tournamentId, staffId, roles[0]);
  if (secondStaffId) {
    await removeStaff(props.tournamentId, secondStaffId, roles[1]);
  }
  const data = await addStaff(props.tournamentId, 'admin', true);
  ElNotification({
    title: (<TemplateNotification>data).subject,
    message: (<TemplateNotification>data).message,
    type: 'success',
    zIndex: 10,
    duration: 0,
  });
  await init();
}

async function addToAnotherRole(role: Exclude<Role, 'admin'>) {
  const data = await addStaff(props.tournamentId, role === 'referee' ? 'mappooler' : 'referee', true);
  ElNotification({
    title: (<TemplateNotification>data).subject,
    message: (<TemplateNotification>data).message,
    type: 'success',
    zIndex: 10,
    duration: 0,
  });
  await init();
}
</script>

<template>
  <div v-if="!initLoading">
    <div v-if="staffsAccepted" v-bind="useAttrs()">
      <div display="flex" align="content-center" justify="between" m="b-6" w="full">
        <h2 m="x-auto" text="xl">Staffs</h2>
        <slot name="goRequests" />
      </div>
      <el-table ref="tableStaff" :data="staffsAccepted" row-key="id" height="max-content" w="full">
        <el-table-column label="User">
          <template #default="scope">
            <div display="flex" align="items-center">
              <el-avatar :src="scope.row.user.avatarUrl" />
              <span m="l-2" text="overflow-ellipsis space-nowrap" overflow="hidden">{{ scope.row.user.username }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Role" column-key="role" align="center">
          <template #default="scope">
            <template v-for="(source, i) in scope.row.sources" :key="i">
              <el-tag>{{ source }}</el-tag>
            </template>
          </template>
        </el-table-column>

        <el-table-column v-if="isAuthorized && (access!.isAdmin || access!.isOwner)" width="40" align="right">
          <template #default="scope">
            <el-dropdown
              v-if="scope.row.sources.includes('mappooler') || scope.row.sources.includes('referee')"
              trigger="click"
            >
              <i-mdi:dots-vertical m="r-4" text="xl" />
              <template #dropdown>
                <el-dropdown-item
                  :icon="Avatar"
                  @click="upToAdmin(scope.row.id, scope.row.sources, scope.row.secondStaffId)"
                  >Up to admin
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="!(scope.row.sources.includes('mappooler') && scope.row.sources.includes('referee'))"
                  :icon="Plus"
                  @click="addToAnotherRole(scope.row.sources[0])"
                >
                  {{ scope.row.sources[0] === 'mappooler' ? 'add to referees' : 'add to mappoolers' }}
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="DeleteFilled"
                  @click="remove(scope.row.id, scope.row.sources, scope.row.secondStaffId)"
                  >remove
                </el-dropdown-item>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-empty v-else>
      <template #description>
        <div display="block" m="b-2">Error</div>
      </template>
    </el-empty>
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
