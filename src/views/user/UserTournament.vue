<script setup lang="ts">
const { fetchCollection } = draftStore();
const { drafts } = storeToRefs(draftStore());
const { user } = userStore();

onBeforeMount(() => fetchCollection());
</script>

<template>
  <div>
    <el-table :data="drafts" w="full">
      <el-table-column prop="name" label="name" />
      <el-table-column label="last update">
        <template #default="scope">
          {{ useTimeAgo(scope.row.updateAt).value }}
        </template>
      </el-table-column>
      <el-table-column label="actions" align="right" width="120" fixed="right">
        <template #default="scope">
          <el-tooltip content="see/edit" placement="left">
            <router-link :to="`/users/${user?.id}/drafts/${scope.row.id}/update`">
              <el-button type="primary" size="small" plain round><i-material-symbols:edit /> </el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip content="Go prod" placement="right">
            <el-button type="success" size="small" plain round m="l-1"><i-material-symbols:send-rounded /> </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-button><router-link to="/tournaments/create">Create new draft</router-link></el-button>
  </div>
</template>
