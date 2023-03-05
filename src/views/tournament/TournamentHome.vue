<script setup lang="ts">
import { Tournament } from '~/types';

const { user } = storeToRefs(userStore());
const { tournaments } = storeToRefs(tournamentStore());
const { fetchTournaments } = tournamentStore();

const initLoading = ref(false);

async function init() {
  await fetchTournaments();
}

onBeforeMount(async () => {
  initLoading.value = true;
  await init();
  initLoading.value = false;
});
</script>

<template>
  <el-card v-if="!initLoading" shadow="never">
    <div display="flex" align="items-center" justify="between" m="b-6">
      <h2 m="x-auto" text="xl">Tournament mappools</h2>
      <router-link v-if="user" :to="`/users/${user.id}/tournaments`" m="l-2">
        <el-button size="small" link> my tournaments</el-button>
      </router-link>
      <el-tooltip content="recruitment of all tournaments" placement="top">
        <router-link :to="`/tournaments/drafts`" m="l-2">
          <el-button size="small" link>tournaments staff</el-button>
        </router-link>
      </el-tooltip>
      <router-link v-if="user" to="/tournaments/drafts/create">
        <el-button type="primary" size="small" m="l-2">create</el-button>
      </router-link>
    </div>
    <el-table :data="tournaments">
      <el-table-column label="owner">
        <template #default="scope: { row: Tournament }">
          <div display="flex" align="items-center">
            <el-avatar :src="scope.row.owner.avatarUrl" />
            <span m="l-2" text="overflow-ellipsis space-nowrap" overflow="hidden">
              {{ scope.row.owner.username }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="name">
        <template #default="scope: { row: Tournament }">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="mode">
        <template #default="scope: { row: Tournament }">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="numbers players">
        <template #default="scope: { row: Tournament }">
          {{ scope.row.numbersPlayers }}
        </template>
      </el-table-column>
      <el-table-column label="start date">
        <template #default="scope: { row: Tournament }">
          {{ scope.row.startDate }}
        </template>
      </el-table-column>
      <el-table-column label="end of registration">
        <template #default="scope: { row: Tournament }">
          {{ scope.row.endRegistration }}
        </template>
      </el-table-column>

      <el-table-column label="actions">
        <template #default="scope: { row: Tournament }">
          <el-tooltip content="see" placement="left">
            <router-link :to="`/tournaments/${scope.row.id}`">
              <el-button type="primary" size="small" plain round m="l-1"><i-mdi:eye /> </el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip content="staff" placement="right">
            <router-link :to="`/tournaments/drafts/${scope.row.draftId}`">
              <el-button type="primary" size="small" plain round m="l-1"><i-fa6-solid:users-gear /> </el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
