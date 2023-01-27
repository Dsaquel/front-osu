<script lang="ts" setup>
import { onBeforeMount } from 'vue';

const { fetchStaffs, removeStaff } = tournamentStore();
const { staffsAccepted } = storeToRefs(tournamentStore());

const props = defineProps<{
  tournamentId: number;
}>();

async function init() {
  fetchStaffs(props.tournamentId);
}

onBeforeMount(async () => {
  init();
});
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
              type="danger"
              size="small"
              round
              m="l-1"
              @click="removeStaff(props.tournamentId, scope.row.id, scope.row.source)"
              ><i-akar-icons:cross />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
