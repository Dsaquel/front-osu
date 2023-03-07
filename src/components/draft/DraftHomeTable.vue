<script setup lang="ts">
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Draft } from '~/types';

dayjs.extend(LocalizedFormat);

const { user } = storeToRefs(userStore());
const { drafts } = storeToRefs(draftStore());
</script>

<template>
  <el-card shadow="never">
    <div display="flex" align="items-center" justify="between" m="b-6">
      <h2 m="x-auto" text="xl">Drafts</h2>

      <router-link v-if="user" to="/tournaments/drafts/create">
        <el-button type="primary" size="small" m="l-2">create</el-button>
      </router-link>
    </div>
    <el-table :data="drafts">
      <el-table-column label="owner">
        <template #default="scope: { row: Draft }">
          <div display="flex" align="items-center">
            <el-avatar :src="scope.row.owner.avatarUrl" />
            <span m="l-2" text="overflow-ellipsis space-nowrap" overflow="hidden">
              {{ scope.row.owner.username }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="name">
        <template #default="scope: { row: Draft }">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="mode">
        <template #default="scope: { row: Draft }">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="numbers players">
        <template #default="scope: { row: Draft }">
          {{ scope.row.numbersPlayers }}
        </template>
      </el-table-column>
      <el-table-column label="estimate start date">
        <template #default="scope: { row: Draft }">
          {{ scope.row.estimateStartDate }}
        </template>
      </el-table-column>
      <el-table-column label="range players">
        <template #default="scope: { row: Draft }">
          {{
            scope.row.rangePlayerMin === 1 && scope.row.rangePlayerMax === null
              ? 'Open rank'
              : `${scope.row.rangePlayerMin} - ${scope.row.rangePlayerMax}`
          }}
        </template>
      </el-table-column>

      <el-table-column label="actions">
        <template #default="scope: { row: Draft }">
          <el-tooltip content="see" placement="left">
            <router-link :to="`/tournaments/drafts/${scope.row.id}`">
              <el-button type="primary" size="small" plain round m="l-1"><i-mdi:eye /> </el-button>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
