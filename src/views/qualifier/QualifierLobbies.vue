<script lang="ts" setup>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { SuperReferee } from '~/types';

dayjs.extend(utc);

const { fetchQualifier, fetchQualifierLobbies } = qualifierStore();
const { qualifier, lobbies } = storeToRefs(qualifierStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);

async function init() {
  await fetchQualifier(tournamentId);
  fetchQualifierLobbies(qualifier.value?.id as number);
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});

function getTypeReferee(row: SuperReferee) {
  //
}
</script>

<template>
  <div v-if="!initLoading && lobbies">
    <el-table :data="lobbies">
      <el-table-column label="status" :width="200">
        <template #default="scope">
          {{ scope.row.superReferee }}
        </template>
      </el-table-column>
      <el-table-column label="status" :width="200">
        <template #default="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
    </el-table>
    <QualifierCreateLobby />
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
