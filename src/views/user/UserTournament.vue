<script setup lang="ts">
import { Draft } from '~/types';

const { fetchUserDrafts } = userStore();
const { updatePrivacy } = draftStore();
const { userDrafts } = storeToRefs(userStore());

const initLoading = ref(false);
const draftIdLoading = ref(undefined as number | undefined);

async function init() {
  await fetchUserDrafts();
}
onBeforeMount(async () => {
  initLoading.value = true;
  await init();
  initLoading.value = false;
});

async function updateDraftPrivacy(draft: Draft) {
  draftIdLoading.value = draft.id;
  await updatePrivacy(draft.id, draft.isPublic);
  await init();
  draftIdLoading.value = undefined;
}
</script>

<template>
  <div>
    <el-table :data="userDrafts" w="full">
      <el-table-column prop="name" label="draft name" />
      <el-table-column label="last update">
        <template #default="scope"> {{ useTimeAgo(scope.row.updateAt).value }} </template>
      </el-table-column>
      <el-table-column label="actions" align="right" width="150" fixed="right">
        <template #default="scope: { row: Draft }">
          <el-switch
            v-if="scope.row.isPublicable"
            v-model="scope.row.isPublic"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="draft visible"
            inactive-text="draft private"
            :loading="scope.row.id === draftIdLoading"
            @change="updateDraftPrivacy(scope.row)"
          />
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
