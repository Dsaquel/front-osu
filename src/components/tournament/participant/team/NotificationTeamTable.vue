<script setup lang="ts">
import router from '~/router';
import { InvitationFromTeam } from '~/types';

defineProps<{
  invitationsFromTeams: InvitationFromTeam[];
}>();

const dropdown = ref();

function openDropdown() {
  dropdown.value.handleOpen();
}
function goParticipants(tournamentId: number, teamId: number) {
  router.push({ name: 'tournament-participants', params: { tournamentId }, query: { teamId } });
  dropdown.value.handleClose();
}
</script>

<template>
  <el-badge
    v-if="invitationsFromTeams"
    :value="invitationsFromTeams.length === 0 ? undefined : invitationsFromTeams.length"
    :max="5"
  >
    <el-dropdown ref="dropdown" trigger="contextmenu">
      <i-mdi:bell class="!outline-none" @click="openDropdown" />
      <template #dropdown>
        <div p="4" w="100" text="xs">
          <el-table :data="invitationsFromTeams" :max-height="250">
            <el-table-column label="tournament">
              <template #default="scope: { row: InvitationFromTeam }">
                {{ scope.row.tournament.name }}
              </template>
            </el-table-column>
            <el-table-column label="team">
              <template #default="scope: { row: InvitationFromTeam }">
                {{ scope.row.participantTeam.name }}
              </template>
            </el-table-column>
            <el-table-column label="actions" align="right" :width="'60px'">
              <template #default="scope: { row: InvitationFromTeam }">
                <div class="gap-1" flex="~ col" align="content-center">
                  <el-button type="success" size="small" m="!0">join</el-button>
                  <el-button type="danger" size="small" m="!0">decline</el-button>
                  <el-button
                    m="!0"
                    size="small"
                    type="primary"
                    @click="goParticipants(scope.row.tournamentId, scope.row.participantTeamId)"
                  >
                    see
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </el-dropdown>
  </el-badge>
</template>
