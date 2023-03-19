<script setup lang="ts">
import { ParticipantIndividual, TemplateNotification } from '~/types';

defineProps<{
  participantsIndividuals: ParticipantIndividual[];
}>();

const { removeParticipant } = tournamentStore();
const { access } = storeToRefs(tournamentStore());
const tournamentId = $ref(parseInt(useRoute().params?.tournamentId as string, 10));

let removeLoading = $ref(false);
const tableParticipant = ref();

async function remove(participantId: number) {
  try {
    removeLoading = true;
    const data = await removeParticipant(participantId, tournamentId);
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
    removeLoading = false;
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
          <el-avatar :src="scope.row.user.avatarUrl"></el-avatar>
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

    <el-table-column label="validate">
      <template #default="scope: { row: ParticipantIndividual }">
        {{ scope.row.validate ? 'yes' : 'no' }}
      </template>
    </el-table-column>

    <el-table-column v-if="access?.isAdmin || access?.isOwner" label="Actions" align="right">
      <template #default="scope: { row: ParticipantIndividual }">
        <el-tooltip content="remove" placement="right">
          <el-button :loading="removeLoading" type="danger" size="small" round m="l-1" @click="remove(scope.row.id)"
            ><i-akar-icons:cross />
          </el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>
