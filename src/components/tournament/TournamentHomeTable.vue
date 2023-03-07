<script setup lang="ts">
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Tournament } from '~/types';

dayjs.extend(LocalizedFormat);

const { user } = storeToRefs(userStore());
const { tournaments } = storeToRefs(tournamentStore());
</script>

<template>
  <el-card shadow="never">
    <h2 text="xl">Tournaments</h2>
    <div display="flex" align="items-center" justify="end" m="b-6">
      <router-link v-if="user" :to="`/users/${user.id}`" m="l-4">
        <el-button size="small" link> my tournaments</el-button>
      </router-link>
      <el-tooltip content="recruitment of all tournaments" placement="top">
        <router-link :to="`/tournaments/drafts`" m="l-4">
          <el-button size="small" link>tournaments staff</el-button>
        </router-link>
      </el-tooltip>
      <router-link v-if="user" to="/tournaments/drafts/create">
        <el-button type="primary" size="small" m="l-4">create</el-button>
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
      <el-table-column label="participants">
        <template #default="scope: { row: Tournament }">
          {{ `${scope.row.participants.length}/${scope.row.numbersPlayers}` }}
        </template>
      </el-table-column>
      <el-table-column label="start date">
        <template #default="scope: { row: Tournament }">
          {{ dayjs(scope.row.startDate).format('dddd, D MMMM LT') }}
        </template>
      </el-table-column>
      <el-table-column label="end of registration">
        <template #default="scope: { row: Tournament }">
          {{ dayjs(scope.row.registrationEndDate).format('dddd, D MMMM LT') }}
        </template>
      </el-table-column>

      <el-table-column>
        <template #default="scope: { row: Tournament }">
          <el-tooltip content="see" placement="left">
            <router-link :to="`/tournaments/${scope.row.id}`">
              <el-button type="primary" size="small" plain round m="l-1"><i-mdi:eye /> </el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip v-if="scope.row.draft.isPublic" content="staff" placement="right">
            <router-link :to="`/tournaments/drafts/${scope.row.draftId}`">
              <el-button type="primary" size="small" plain round m="l-1"><i-fa6-solid:users-gear /> </el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
