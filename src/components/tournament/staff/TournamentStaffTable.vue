<script setup lang="ts">
import { ElNotification } from 'element-plus';
import { Role, Staff } from '~/types';

const { removeStaff } = tournamentStore();
const { staffRequests } = storeToRefs(tournamentStore());

defineProps<{
  data: typeof staffRequests.value;
}>();

let removeLoading = $ref(false);
const tableStaff = ref();
function filterRequests(value: Role, row: Staff & { source: Role }) {
  return value === row.source;
}

function clearFilter() {
  tableStaff.value.clearFilter(['role']);
  tableStaff.value.clearSelection();
}

async function remove(tournamentId: number, staffId: number, role: Role) {
  try {
    removeLoading = true;
    const data = await removeStaff(tournamentId, staffId, role);
    ElNotification({ title: data.subject, message: data.message, type: 'success', zIndex: 10, duration: 0 });
  } catch (e: unknown) {
    ElNotification({ message: e as string, type: 'error', zIndex: 10, duration: 0 });
  } finally {
    removeLoading = false;
  }
}
</script>

<template>
  <el-button @click="clearFilter">reset all filters</el-button>

  <el-table
    ref="tableStaff"
    :data="data"
    row-key="id"
    stripe
    height="max-content"
    w="full"
    :highlight-current-row="true"
  >
    <el-table-column label="Candidate">
      <template #default="scope">
        <div display="flex" align="items-center">
          <el-avatar :src="scope.row.user.avatarUrl"></el-avatar>
          <span m="l-2">{{ scope.row.user.username }}</span>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="Profile">
      <template #default="scope">
        <a :href="`https://osu.ppy.sh/users/${scope.row.user.osuId}`" target="_blank">
          <el-button type="primary" size="small" link>osu profile</el-button>
        </a>
      </template>
    </el-table-column>

    <el-table-column
      label="Request for"
      :filter-method="filterRequests"
      :filters="[
        { text: 'admin', value: 'admin' },
        { text: 'mappooler', value: 'mappooler' },
        { text: 'referee', value: 'referee' },
      ]"
      column-key="role"
      :width="200"
    >
      <template #default="scope">
        <el-tag>{{ scope.row.source }}</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="Actions" align="right">
      <template #default="scope">
        <slot :extra-btn="scope.row" />
        <el-tooltip content="remove" placement="right">
          <el-button
            :loading="removeLoading"
            type="danger"
            size="small"
            round
            m="l-1"
            @click="remove(scope.row.tournamentId, scope.row.id, scope.row.source)"
            ><i-akar-icons:cross />
          </el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>
