<script setup lang="ts">
import { ParticipantTeam } from '~/types';

const { fetchParticipantsTeamRequest } = tournamentStore();
const {} = storeToRefs(tournamentStore());

const props = defineProps<{
  team: ParticipantTeam;
  tournamentId: number;
}>();

const showDialog = ref(false);
const activeTab = ref('requests');

onBeforeMount(() => {
  fetchParticipantsTeamRequest(props.tournamentId, props.team.id);
});

function resetData() {
  //
}
</script>

<template>
  <el-button type="primary" round @click="showDialog = true">manage</el-button>

  <el-dialog v-model="showDialog" title="Manage your team" w="5/10 min-[600px]" align-center @closed="resetData">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Requests" name="requests">requests</el-tab-pane>
      <el-tab-pane label="Invitations" name="invitations">invitations</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
