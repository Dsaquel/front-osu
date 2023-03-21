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
const selectValue = ref(undefined as string | undefined);

onBeforeMount(async () => {
  teamsLoading.value = true;
  await fetchTeams(tournamentId);
  teamsLoading.value = false;
});

async function participate() {
  // teamName?: string, id?: number
  participantLoading.value = true;
  showDialog.value = false;
  try {
    console.log(bla.value);
    const notification = teamName
      ? await addTeamParticipant(tournamentId, teamName, id)
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
      <el-alert type="info" title="Keep in mind" :closable="false">
        to validate a team you must be
        {{
          tournament!.teamNumberMax === tournament!.teamNumberMin
            ? tournament!.teamNumberMax
            : `in range ${tournament!.teamNumberMin} to ${tournament!.teamNumberMax}`
        }}
      </el-alert>
      <el-switch v-model="creatingTeam" size="large" active-text="create team" inactive-text="join team" />

      <el-input v-if="creatingTeam" placeholder="team name"></el-input>
      <el-select v-else v-model="selectValue" clearable filterable size="large">
        <el-option v-for="team in teams" :key="team.id" :value="team.name" />
        <template #empty>
          <div class="el-select-dropdown__empty">no teams yet</div>
        </template>
      </el-select>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button type="primary" @click="participate"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>
