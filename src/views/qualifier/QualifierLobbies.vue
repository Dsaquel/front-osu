<script lang="ts" setup>
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Lobby } from '~/types';

dayjs.extend(utc);

const { fetchQualifier, fetchQualifierLobbies, addParticipantToLobby } = qualifierStore();
const { fetchTournament } = tournamentStore();
const { isAuthorized, access, tournament } = storeToRefs(tournamentStore());
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
      <QualifierCreateLobby />
    </div>
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
      <el-table-column label="participants">
        <template #default="scope">
          <template v-for="(participant, i) in getLobby(scope.row).participantsLobby" :key="i">
            <el-popover
              trigger="hover"
              width="auto"
              placement="bottom"
              :title="participant.user.username"
              :content="`rank: ${participant.user.rank}\ndiscord: ${participant.user.discord}`"
            >
              <template #reference>
                <el-avatar :class="{ 'transform translate-x-[-10px]': !!i }" :src="participant.user.avatarUrl" />
              </template>
            </el-popover>
          </template>
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
            :content="dayjs(getLobby(scope.row).schedule).format('MMMM - dddd - YYYY')"
          >
            <template #reference>
              <span>{{ useTimeAgo(getLobby(scope.row).schedule).value }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="actions" align="center" :width="200">
        <template #default="scope">
          <el-button
            v-if="isAuthorized && (access?.isAdmin || access?.isOwner || access?.isReferee)"
            type="danger"
            size="small"
            text
          >
            delete
          </el-button>
          <!-- TODO: verify if user is a participant-->
          <el-button
            type="success"
            size="small"
            text
            m="l-1"
            @click="addParticipantToLobby(getLobby(scope.row).id, qualifier?.id as number)"
          >
            go here
          </el-button>
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
</style>
