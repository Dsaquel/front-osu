<script lang="ts" setup>
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Lobby } from '~/types';

dayjs.extend(LocalizedFormat);

const { fetchQualifier, fetchQualifierLobbies, addParticipantToLobby } = qualifierStore();
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
  <el-card v-if="!initLoading && lobbies" shadow="never">
    <div display="flex" align="items-center" justify="between" m="b-6 t-2">
      <h2 m="x-auto" text="xl">Qualifier Lobbies</h2>
      <LobbyCreate />
    </div>
    <el-table :data="lobbies" cell-class-name="cell-padding">
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
      <el-table-column label="participants">
        <template #default="scope">
          <template v-for="(participant, i) in getLobby(scope.row).participantsLobby" :key="i">
            <el-popover
              trigger="hover"
              width="auto"
              placement="bottom"
              :hide-after="50"
              :title="participant.user.username"
              :content="`rank: ${participant.user.rank}\ndiscord: ${participant.user.discord}`"
            >
              <template #reference>
                <el-avatar class="float-left ml-[-10px]" :src="participant.user.avatarUrl" />
              </template>
            </el-popover>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="status" :width="100">
        <template #default="scope">
          {{ getLobby(scope.row).status }}
        </template>
      </el-table-column>
      <el-table-column label="scheduled" :width="100">
        <template #default="scope">
          <el-popover
            trigger="hover"
            width="auto"
            placement="bottom"
            :content="dayjs(getLobby(scope.row).schedule).format('LLLL')"
          >
            <template #reference>
              <span>{{ useTimeAgo(getLobby(scope.row).schedule).value }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="actions" align="center">
        <template #default="scope">
          <!-- TODO: verify if user is a participant and he playe already in a lobby -->
          <el-button
            type="success"
            size="small"
            m="l-1"
            @click="addParticipantToLobby(getLobby(scope.row).id, qualifier?.id as number)"
          >
            join
          </el-button>
          <LobbySettings
            :lobby-id="getLobby(scope.row).id"
            :status="getLobby(scope.row).status"
            :schedule="getLobby(scope.row).schedule"
            :update-at="getLobby(scope.row).updateAt"
            :title="
              'host by ' +
              (getLobby(scope.row).superReferee.admin?.user.username ||
                getLobby(scope.row).superReferee.referee?.user.username ||
                tournament?.owner.username)
            "
          />
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
