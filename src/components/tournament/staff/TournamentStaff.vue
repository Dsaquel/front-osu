<script lang="ts" setup>
import { Avatar, DeleteFilled, Plus } from '@element-plus/icons-vue';
import { onBeforeMount } from 'vue';
import { Role, TemplateNotification } from '~/types';

const { fetchStaffs, removeStaff } = tournamentStore();
const { staffsAccepted } = storeToRefs(tournamentStore());
const { isAuthorized, access } = storeToRefs(tournamentStore());

const props = defineProps<{
  tournamentId: number;
}>();
let removeLoading = $ref(false);
async function init() {
  fetchStaffs(props.tournamentId);
}

onBeforeMount(async () => {
  init();
});

async function remove(staffId: number, role: Role) {
  try {
    removeLoading = true;
    const data = await removeStaff(props.tournamentId, staffId, role);
    ElNotification({ title: data.subject, message: data.message, type: 'success', zIndex: 10, duration: 0 });
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
  } finally {
    removeLoading = false;
  }
}
</script>

<template>
  <div v-bind="useAttrs()">
    <slot name="goRequests" />
    <el-table ref="tableStaff" :data="staffsAccepted" row-key="id" height="max-content" w="full">
      <el-table-column label="User">
        <template #default="scope">
          <div display="flex" align="items-center">
            <el-avatar :src="scope.row.user.avatarUrl"></el-avatar>
            <span m="l-2">{{ scope.row.user.username }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Role" column-key="role" align="center">
        <template #default="scope">
          <el-tag>{{ scope.row.source }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="isAuthorized && (access!.isAdmin || access!.isOwner)" label="actions" align="right">
        <template #default="scope">
          <el-dropdown trigger="click">
            <i-mdi:dots-vertical v-if="'mappooler' || 'referee' in scope.row" m="r-4" text="xl" />
            <template #dropdown>
              <el-dropdown-item :icon="Avatar">Up to admin </el-dropdown-item>
              <el-dropdown-item :icon="Plus">
                {{ scope.row === 'mappooler' ? 'add to mappoolers' : 'add to referees' }}
              </el-dropdown-item>
              <el-dropdown-item :icon="DeleteFilled" @click="remove(scope.row.id, scope.row.source)"
                >remove
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
