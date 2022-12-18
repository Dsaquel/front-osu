<script setup lang="ts">
const { fetch, tournaments } = tournamentDraftStore();

onBeforeMount(() => fetch());
</script>

<template>
  <el-table :data="tournaments" w="full">
    <el-table-column prop="name" label="name" />
    <el-table-column label="last update">
      <template #default="scope">
        {{ useTimeAgo(scope.row.updateAt).value }}
      </template>
    </el-table-column>
    <el-table-column label="operation">
      
    </el-table-column>
  </el-table>
</template>
