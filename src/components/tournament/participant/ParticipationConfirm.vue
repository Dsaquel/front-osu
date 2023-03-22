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

const getCaptain = () => teams.value?.find((team) => team.id === teamId.value)?.captain;

function resetData() {
  newTeamName.value = undefined;
  teamId.value = undefined;
  creatingTeam.value = false;
}

async function participate() {
  try {
    if (!tournament.value) return;
    if (tournament.value.type === TournamentType.Team) {
      const teamNumber =
        tournament.value.teamNumberMax === tournament.value.teamNumberMin
          ? tournament.value.teamNumberMax
          : `in range ${tournament.value.teamNumberMin} to ${tournament.value.teamNumberMax}`;
      const createTeamMessage = `After confirm you need to be ${teamNumber} players.`;
      const joinTeamMessage = `After confirm ${getCaptain()?.username} must validate you.`;
      await ElMessageBox.confirm(creatingTeam.value ? createTeamMessage : joinTeamMessage, 'keep in mind', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'info',
      });
    }
    participantLoading.value = true;
    showDialog.value = false;
    const notification =
      tournament.value.type === TournamentType.Team && creatingTeam.value
        ? await addTeamParticipant(tournamentId, newTeamName.value) // create team
        : tournament.value.type === TournamentType.Team && !creatingTeam.value
        ? await addTeamParticipant(tournamentId, undefined, teamId.value) // join team
        : await addIndividualParticipant(tournamentId);

    ElNotification({
      title: (<TemplateNotification>notification).subject,
      message: (<TemplateNotification>notification).message,
      type: 'success',
      zIndex: 10,
      duration: 0,
    });
    resetData();
  } catch (e) {
    console.log(e);
  } finally {
    participantLoading.value = false;
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
  <el-dialog v-model="showDialog" title="Confirmation" w="5/10 min-[600px]" align-center @closed="resetData">
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
