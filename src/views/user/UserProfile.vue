<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Draft } from '~/types';

dayjs.extend(utc);
const { fetchUserDrafts, fetchUserInvolvement } = userStore();
const { user } = storeToRefs(userStore());
const { updateDraftPrivacy } = draftStore();
const { userDrafts, userInvolvement } = storeToRefs(userStore());

const initLoading = ref(false);
const draftIdLoading = ref(undefined as number | undefined);

async function init() {
  try {
    await fetchUserDrafts();
    await fetchUserInvolvement();
  } catch (e) {
    console.log('init error', e);
  }
}
onBeforeMount(async () => {
  initLoading.value = true;
  await init();
  initLoading.value = false;
});

async function updateDraftPrivacyTemplate(draft: Draft) {
  draftIdLoading.value = draft.id;
  await updateDraftPrivacy(draft.id, draft.isPublic);
  await init();
  draftIdLoading.value = undefined;
}
</script>

<template>
  <div v-if="!initLoading">
    <div display="flex" align="items-center" justify="between" m="b-6">
      <h2 m="x-auto" text="xl">Drafts</h2>
      <router-link v-if="user" :to="{ name: 'draft-create' }">
        <el-button type="primary" size="small" m="l-4">create new draft</el-button>
      </router-link>
    </div>
    <el-table :data="userDrafts" w="full">
      <el-table-column prop="name" label="draft name" />
      <el-table-column label="estimate start date">
        <template #default="scope: { row: Draft }">
          {{ dayjs(scope.row.estimateStartDate).format('MMMM') }}
        </template>
      </el-table-column>
      <el-table-column label="last update">
        <template #default="scope"> {{ useTimeAgo(scope.row.updateAt).value }} </template>
      </el-table-column>
      <el-table-column label="actions" align="center" width="150" fixed="right">
        <template #default="scope: { row: Draft }">
          <el-switch
            v-if="scope.row.isPublicable"
            v-model="scope.row.isPublic"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="draft visible"
            inactive-text="draft private"
            :loading="scope.row.id === draftIdLoading"
            @change="updateDraftPrivacyTemplate(scope.row)"
          />
          <el-tooltip
            v-if="scope.row.tournament.isPublic || (user && scope.row.ownerId === user.id)"
            content="tournament"
            placement="left"
          >
            <router-link :to="`/tournaments/${scope.row.tournament.id}`">
              <el-button type="primary" size="small" plain round><i-mdi:tournament /> </el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip v-if="user && scope.row.ownerId === user.id" content="see/edit" placement="top">
            <router-link :to="`/tournaments/drafts/${scope.row.id}/update`">
              <el-button type="primary" size="small" plain round m="l-1"><i-material-symbols:edit /> </el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip
            v-if="scope.row.isPublic || (user && scope.row.ownerId === user.id)"
            content="see"
            placement="right"
          >
            <router-link :to="`/tournaments/drafts/${scope.row.id}`">
              <el-button type="primary" size="small" plain round m="l-1"><i-mdi:eye /> </el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--  -->
    <div display="flex" align="items-center" justify="between" m="b-6">
      <h2 m="x-auto" text="xl">Involvement</h2>
      <router-link v-if="user" :to="{ name: 'draft-create' }">
        <el-button type="primary" size="small" m="l-4">see new tournaments</el-button>
      </router-link>
    </div>
    <el-table :data="userInvolvement" w="full">
      <el-table-column prop="name" label="draft name" />
      <el-table-column label="estimate start date">
        <template #default="scope: { row: Draft }">
          {{ dayjs(scope.row.estimateStartDate).format('MMMM') }}
        </template>
      </el-table-column>
      <el-table-column label="last update">
        <template #default="scope"> {{ useTimeAgo(scope.row.updateAt).value }} </template>
      </el-table-column>
      <el-table-column label="actions" align="center" width="150" fixed="right">
        <template #default="scope: { row: Draft }">
          <el-switch
            v-if="scope.row.isPublicable"
            v-model="scope.row.isPublic"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="draft visible"
            inactive-text="draft private"
            :loading="scope.row.id === draftIdLoading"
            @change="updateDraftPrivacyTemplate(scope.row)"
          />
          <el-tooltip
            v-if="scope.row.tournament.isPublic || (user && scope.row.ownerId === user.id)"
            content="tournament"
            placement="left"
          >
            <router-link :to="`/tournaments/${scope.row.tournament.id}`">
              <el-button type="primary" size="small" plain round><i-mdi:tournament /> </el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip v-if="user && scope.row.ownerId === user.id" content="see/edit" placement="top">
            <router-link :to="`/tournaments/drafts/${scope.row.id}/update`">
              <el-button type="primary" size="small" plain round m="l-1"><i-material-symbols:edit /> </el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip
            v-if="scope.row.isPublic || (user && scope.row.ownerId === user.id)"
            content="see"
            placement="right"
          >
            <router-link :to="`/tournaments/drafts/${scope.row.id}`">
              <el-button type="primary" size="small" plain round m="l-1"><i-mdi:eye /> </el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
