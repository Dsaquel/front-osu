<script setup lang="ts">
const { fetchCollection, drafts } = draftStore();
const { user } = userStore();

onBeforeMount(() => fetchCollection());
</script>

<template>
  <el-table :data="drafts" w="full">
    <el-table-column prop="name" label="name" />
    <el-table-column label="last update">
      <template #default="scope">
        {{ useTimeAgo(scope.row.updateAt).value }}
      </template>
    </el-table-column>
  </el-table>
  <el-button><router-link to="/tournaments/create">Create new draft</router-link></el-button>
</template>
