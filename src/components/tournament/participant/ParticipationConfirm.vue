<script setup lang="ts">
import { TemplateNotification, TournamentType } from '~/types';

const { addIndividualParticipant, addTeamParticipant, fetchTeams } = tournamentStore();
const { user } = storeToRefs(userStore());
const { tournament, isAuthorized, teams } = storeToRefs(tournamentStore());
const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

const showDialog = ref(false);
const participantLoading = ref(false);
const teamsLoading = ref(false);
const creatingTeam = ref(false);
const teamId = ref(undefined as number | undefined);
const newTeamName = ref(undefined as string | undefined);

onBeforeMount(async () => {
  teamsLoading.value = true;
  await fetchTeams(tournamentId);
  teamsLoading.value = false;
});

async function participate() {
  participantLoading.value = true;
  showDialog.value = false;
  try {
    if (!tournament.value) return;
    if (tournament.value.type === TournamentType.Team) {
      const teamNumber =
        tournament.value.teamNumberMax === tournament.value.teamNumberMin
          ? tournament.value.teamNumberMax
          : `in range ${tournament.value.teamNumberMin} to ${tournament.value.teamNumberMax}`;

      await ElMessageBox.confirm(`To validate a team, you be ${teamNumber} players.`, 'keep in mind', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'info',
      });
    }

    const notification =
      tournament.value.type === TournamentType.Team && creatingTeam
        ? await addTeamParticipant(tournamentId, newTeamName.value) // create team
        : tournament.value.type === TournamentType.Team && !creatingTeam
        ? await addTeamParticipant(tournamentId, undefined, teamId.value) // join team
        : await addIndividualParticipant(tournamentId);

    ElNotification({
      title: (<TemplateNotification>notification).subject,
      message: (<TemplateNotification>notification).message,
      type: 'success',
      zIndex: 10,
      duration: 0,
    });
  } catch (e) {
    console.log(e);
  } finally {
    participantLoading.value = false;
    newTeamName.value = undefined;
    teamId.value = undefined;
  }
}
</script>

<template>
  <el-popover
    v-if="isAuthorized || tournament!.registrationEnd"
    placement="top-start"
    trigger="hover"
    width="auto"
    :content="isAuthorized ? 'You are in the staffs' : 'registration ended'"
  >
    <template #reference>
      <div m="t-4" place="self-end">
        <el-button
          :disabled="isAuthorized || tournament!.registrationEnd"
          :loading="participantLoading"
          type="success"
          @click="showDialog = true"
        >
          participate
        </el-button>
      </div>
    </template>
  </el-popover>
  <el-button
    v-else-if="user"
    m="t-4"
    place="self-end"
    :disabled="isAuthorized || tournament!.registrationEnd"
    :loading="participantLoading"
    type="success"
    @click="showDialog = true"
  >
    participate
  </el-button>
  <el-dialog v-model="showDialog" title="Confirmation" w="5/10 min-[600px]" align-center>
    <div v-if="tournament!.type === TournamentType.Solo">
      <div text="lg center">Are you sure to participate ?</div>
      <div text="sm center space-nowrap">If you have any participation in the staff they will be removed</div>
    </div>
    <div v-else>
      <div grid="~ cols-2">
        <div>
          <el-switch v-model="creatingTeam" size="large" active-text="create team" inactive-text="join team" />
        </div>

        <div>
          <el-input v-if="creatingTeam" v-model="newTeamName" size="large" placeholder="team name" />
          <el-select v-else v-model="teamId" clearable filterable size="large">
            <el-option v-for="team in teams" :key="team.id" :label="team.name" :value="team.id" />
            <template #empty>
              <div class="el-select-dropdown__empty">no teams yet</div>
            </template>
          </el-select>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button type="primary" @click="participate"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>
