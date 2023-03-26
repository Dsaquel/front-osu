<script setup lang="ts">
import router from '~/router';
import { InvitationFromTeam, InvitationTeam, TemplateNotification } from '~/types';

const { changeInvitationStatus } = tournamentStore();

defineProps<{
  invitationsFromTeams: InvitationFromTeam[];
}>();

const dropdown = ref();
const loadingStatus = ref(undefined as InvitationTeam['status'] | undefined);
const loadingInvitationId = ref(undefined as number | undefined);

function openDropdown() {
  dropdown.value.handleOpen();
}
function goParticipants(tournamentId: number, teamId: number) {
  router.push({ name: 'tournament-participants', params: { tournamentId }, query: { teamId } });
  dropdown.value.handleClose();
}

async function changeInvitationStatusTemplate(
  invitationId: number,
  status: 'accepted' | 'declined',
  teamId: number,
  tournamentId: number,
) {
  loadingStatus.value = status;
  loadingInvitationId.value = invitationId;
  try {
    const notification = await changeInvitationStatus(tournamentId, invitationId, status, teamId);
    ElMessage({
      message: (<TemplateNotification>notification).message,
      type: 'success',
      zIndex: 10,
      duration: 2000,
    });
  } catch (e) {
    console.log(e);
  } finally {
    loadingStatus.value = undefined;
    loadingInvitationId.value = undefined;
    dropdown.value.handleClose();
  }
}
</script>

<template>
  <el-dropdown ref="dropdown" trigger="contextmenu">
    <el-badge :value="invitationsFromTeams.length === 0 ? undefined : invitationsFromTeams.length" :max="5">
      <i-mdi:bell class="!outline-none" @click="openDropdown" />
    </el-badge>
    <template #dropdown>
      <div p="4" w="100" text="xs">
        <el-table :data="invitationsFromTeams" :max-height="250" empty-text="no invitation">
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
          <el-table-column align="right" :width="'60px'">
            <template #default="scope: { row: InvitationFromTeam }">
              <div class="gap-1" flex="~ col" align="content-center">
                <el-button
                  type="success"
                  size="small"
                  m="!0"
                  @click="
                    changeInvitationStatusTemplate(
                      scope.row.id,
                      'accepted',
                      scope.row.participantTeamId,
                      scope.row.tournamentId,
                    )
                  "
                  >join
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  m="!0"
                  @click="
                    changeInvitationStatusTemplate(
                      scope.row.id,
                      'declined',
                      scope.row.participantTeamId,
                      scope.row.tournamentId,
                    )
                  "
                  >decline
                </el-button>
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
</template>
