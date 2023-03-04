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
  <div v-if="!initLoading">
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
          <el-tooltip content="see" placement="right">
            <router-link :to="`/tournaments/${scope.row.id}`">
              <el-button type="primary" size="small" plain round m="l-1"><i-mdi:eye /> </el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip content="see" placement="right">
            <router-link :to="`/tournaments/${scope.row.id}`">
              <el-button type="primary" size="small" plain round m="l-1"><i-mdi:eye /> </el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <router-link class="bare" to="/tournaments/drafts/create">Create your tournament </router-link>
    <router-link v-if="user" class="bare" :to="`/users/${user.id}/tournaments`">See your drafts </router-link>
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
