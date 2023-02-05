<script lang="ts" setup>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Lobby } from '~/types';

dayjs.extend(utc);

const { fetchQualifier, fetchQualifierLobbies } = qualifierStore();
const { fetchTournament } = tournamentStore();
const { tournament } = storeToRefs(tournamentStore());
const { qualifier, lobbies } = storeToRefs(qualifierStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);

async function init() {
  await fetchQualifier(tournamentId);
  await fetchTournament(tournamentId);
  fetchQualifierLobbies(qualifier.value?.id as number);
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});

function getLobby(row: Lobby) {
  return row;
}
</script>

<template>
  <div v-if="!initLoading && lobbies">
    <el-table :data="lobbies">
      <el-table-column label="referee host">
        <template #default="scope">
          <div display="flex" align="items-center">
            <el-avatar
              :src="
                getLobby(scope.row).superReferee.admin?.user.avatarUrl ||
                getLobby(scope.row).superReferee.referee?.user.avatarUrl ||
                tournament?.owner.avatarUrl
              "
            />
            <span m="l-2" text="overflow-ellipsis space-nowrap" overflow="hidden">
              {{
                getLobby(scope.row).superReferee.admin?.user.username ||
                getLobby(scope.row).superReferee.referee?.user.username ||
                tournament?.owner.username
              }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="status" :width="200">
        <template #default="scope">
          {{ getLobby(scope.row).status }}
        </template>
      </el-table-column>
      <el-table-column label="scheduled" :width="200">
        <template #default="scope">
          <el-popover
            trigger="hover"
            width="auto"
            placement="bottom"
            :content="dayjs(getLobby(scope.row).schedule).format('MM/DD/YYYY')"
          >
            <template #reference>
              <span>{{ useTimeAgo(getLobby(scope.row).schedule).value }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <QualifierCreateLobby />
  </div>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>
