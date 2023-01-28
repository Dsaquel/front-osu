<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { Role, TemplateNotification } from '~/types';

const { fetchStaffs, removeStaff } = tournamentStore();
const { staffsAccepted } = storeToRefs(tournamentStore());

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
  <div>
    <slot name="goRequests" />
    <el-table ref="tableStaff" :data="staffsAccepted" row-key="id" height="max-content" w="full">
      <el-table-column label="Candidate">
        <template #default="scope">
          <div display="flex" align="items-center">
            <el-avatar :src="scope.row.user.avatarUrl"></el-avatar>
            <span m="l-2">{{ scope.row.user.username }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Role" column-key="role" align="right">
        <template #default="scope">
          <el-tag>{{ scope.row.source }}</el-tag>
          <el-tooltip content="remove" placement="right">
            <el-button
              :loading="removeLoading"
              type="danger"
              size="small"
              round
              m="l-1"
              @click="remove(scope.row.id, scope.row.source)"
              ><i-akar-icons:cross />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
