<script setup lang="ts">
import { ParticipantIndividual, TemplateNotification } from '~/types';

defineProps<{
  participantsIndividuals: ParticipantIndividual[];
}>();

const { updateParticipantValidation } = tournamentStore();
const { isOwnerOrAdmin } = storeToRefs(tournamentStore());
const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

const updateLoading = ref(false);
const tableParticipant = ref();

async function udpateParticipantValidationTemplate(participantId: number, validate: boolean) {
  try {
    updateLoading.value = true;
    const data = await updateParticipantValidation(participantId, tournamentId, validate);
    ElNotification({
      title: (<TemplateNotification>data).subject,
      message: (<TemplateNotification>data).message,
      type: 'success',
      zIndex: 10,
      duration: 0,
    });
  } catch (e) {
    console.log(e);
  } finally {
    updateLoading.value = false;
  }
}
</script>

<template>
  <el-table
    ref="tableParticipant"
    :data="participantsIndividuals"
    row-key="id"
    stripe
    height="max-content"
    w="full"
    :highlight-current-row="true"
  >
    <el-table-column label="Participant">
      <template #default="scope: { row: ParticipantIndividual }">
        <div display="flex" align="items-center">
          <el-avatar :src="scope.row.user.avatarUrl" />
          <span m="l-2">{{ scope.row.user.username }}</span>
        </div>
      </template>
    </el-table-column>

    <el-table-column label="Rank">
      <template #default="scope">
        {{ scope.row.user.rank }}
      </template>
    </el-table-column>

    <el-table-column label="Discord">
      <template #default="scope: { row: ParticipantIndividual }">
        {{ scope.row.user.discord }}
      </template>
    </el-table-column>

    <el-table-column v-if="isOwnerOrAdmin" label="validate">
      <template #default="scope: { row: ParticipantIndividual }">
        {{ scope.row.validate ? 'yes' : 'no' }}
      </template>
    </el-table-column>

    <el-table-column v-if="isOwnerOrAdmin" label="Actions" align="right">
      <template #default="scope: { row: ParticipantIndividual }">
        <el-switch
          v-model="scope.row.validate"
          inline-prompt
          size="large"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="validate"
          inactive-text="invalidate"
          :loading="updateLoading"
          @change="udpateParticipantValidationTemplate(scope.row.id, scope.row.validate)"
        />
      </template>
    </el-table-column>
  </el-table>
</template>
