<script setup lang="ts">
const { fetchDraftsCollection } = draftStore();
const { drafts } = storeToRefs(draftStore());

const initLoading = ref(false);

async function init() {
  fetchDraftsCollection();
}
onBeforeMount(async () => {
  initLoading.value = true;
  await init();
  initLoading.value = false;
});
</script>

<template>
  <div>
    <el-table :data="drafts" w="full">
      <el-table-column prop="name" label="draft name" />
      <el-table-column label="last update">
        <template #default="scope"> {{ useTimeAgo(scope.row.updateAt).value }} </template>
      </el-table-column>
      <el-table-column label="actions" align="right" width="150" fixed="right">
        <template #default="scope">
          <el-tooltip content="tournament" placement="left">
            <router-link :to="`/tournaments/${scope.row.tournament.id}`">
              <el-button type="primary" size="small" plain round><i-mdi:tournament /> </el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip content="see/edit" placement="top">
            <router-link :to="`/tournaments/drafts/${scope.row.id}/update`">
              <el-button type="primary" size="small" plain round m="l-1"><i-material-symbols:edit /> </el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip content="see" placement="right">
            <router-link :to="`/tournaments/drafts/${scope.row.id}`">
              <el-button type="primary" size="small" plain round m="l-1"><i-mdi:eye /> </el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-button><router-link :to="{ name: 'draft-create' }">Create new draft</router-link></el-button>
  </div>
</template>
