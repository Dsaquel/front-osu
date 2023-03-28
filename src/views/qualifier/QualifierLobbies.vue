<script lang="ts" setup>
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Lobby, SuperReferee } from '~/types';

dayjs.extend(LocalizedFormat);

const { fetchQualifier, fetchQualifierLobbies, addParticipantToLobby } = qualifierStore();
const { fetchTournament } = tournamentStore();
const { user } = storeToRefs(userStore());
const { tournament } = storeToRefs(tournamentStore());
const { qualifier, lobbies } = storeToRefs(qualifierStore());

const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));
let initLoading = $ref(false);
async function init() {
  await fetchQualifier(tournamentId);
  await fetchTournament(tournamentId);
  await fetchQualifierLobbies(qualifier.value?.id as number);
}

onBeforeMount(async () => {
  initLoading = true;
  await init();
  initLoading = false;
});

function getHost(superReferee: SuperReferee) {
  return `host by ${
    superReferee.admin?.user.username || superReferee.referee?.user.username || tournament.value?.owner.username
  }`;
}
</script>

<template>
  <el-card v-if="!initLoading && lobbies" shadow="never">
    <div display="flex" align="items-center" justify="between" m="b-6 t-2">
      <h2 m="x-auto" text="xl">Qualifier Lobbies</h2>
      <LobbyCreate />
    </div>
    <el-table :data="lobbies" cell-class-name="cell-padding">
      <el-table-column label="referee host">
        <template #default="scope: { row: Lobby }">
          <div display="flex" align="items-center">
            <el-avatar
              :src="
                scope.row.superReferee.admin?.user.avatarUrl ||
                scope.row.superReferee.referee?.user.avatarUrl ||
                tournament?.owner.avatarUrl
              "
            />
            <span m="l-2" text="overflow-ellipsis space-nowrap" overflow="hidden">
              {{
                scope.row.superReferee.admin?.user.username ||
                scope.row.superReferee.referee?.user.username ||
                tournament?.owner.username
              }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="participants">
        <template #default="scope: { row: Lobby }">
          <template v-for="participant in scope.row.participantsLobby" :key="participant.id">
            <el-tooltip :content="participant.username">
              <el-avatar class="float-left ml-[-10px]" :src="participant.avatarUrl" />
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="status" :width="100">
        <template #default="scope: { row: Lobby }">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="scheduled" :width="100">
        <template #default="scope: { row: Lobby }">
          <el-popover
            trigger="hover"
            width="auto"
            placement="bottom"
            :content="dayjs(scope.row.schedule).format('LLLL')"
          >
            <template #reference>
              <span>{{ useTimeAgo(scope.row.schedule).value }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="actions">
        <template #default="scope: { row: Lobby }">
          <div flex="~ row" align="items-center content-center">
            <el-button
              v-if="user && tournament && tournament.participants.map((p) => p.id).includes(user.id)"
              type="success"
              m="l-1"
              @click="addParticipantToLobby(scope.row.id, qualifier?.id as number)"
            >
              join
            </el-button>
            <LobbySettings
              :lobby-id="scope.row.id"
              :status="scope.row.status"
              :schedule="scope.row.schedule"
              :update-at="scope.row.updateAt"
              :title="getHost(scope.row.superReferee)"
            />
            <LobbySetScores :title="getHost(scope.row.superReferee)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <div v-else v-loading.fullscreen.lock="initLoading" />
</template>

<style scoped lang="scss">
:global(.el-popper) {
  white-space: pre-wrap;
}

:deep(.el-table__inner-wrapper::before) {
  z-index: 1;
}

:deep(.cell:first-child) {
  padding-left: 10px;
}
</style>
