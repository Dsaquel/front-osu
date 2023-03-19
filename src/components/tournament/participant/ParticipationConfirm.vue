<script setup lang="ts">
import { TemplateNotification, TournamentType } from '~/types';

const { addParticipant } = tournamentStore();
const { user } = storeToRefs(userStore());
const { tournament, isAuthorized } = storeToRefs(tournamentStore());
const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

const showDialog = ref(false);
const participantLoading = ref(false);

async function participate() {
  participantLoading.value = true;
  showDialog.value = false;
  try {
    const notification = await addParticipant(tournamentId);

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
  <el-dialog v-model="showDialog" title="Confirmation" width="auto" align-center>
    <div v-if="tournament!.type === TournamentType.Solo">
      <div text="lg center">Are you sure to participate ?</div>
      <div text="sm center space-nowrap">If you have any participation in the staff they will be removed</div>
    </div>
    <div v-else>yooo</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button type="primary" @click="participate"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>
